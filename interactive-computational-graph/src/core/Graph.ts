import type ChainRuleTerm from "./ChainRuleTerm";
import {
  CycleError,
  InputNodeAlreadyConnectedError,
  InputPortFullError,
} from "./CoreErrors";
import type CoreNode from "./CoreNode";
import type DifferentiationMode from "./DifferentiationMode";
import type NodeType from "./NodeType";

type NeighborDirection = "TO_OUTPUT" | "TO_INPUT";

interface TopologicalSortCallStackElement {
  nodeId: string;
  hasVisitedDependents: boolean;
}

class Graph {
  private readonly nodeIdToNodes = new Map<string, CoreNode>();

  private differentiationMode: DifferentiationMode = "REVERSE";

  private targetNodeId: string | null = null;

  /**
   * Records the valid derivatives for all the nodes that are propagated from
   * the current target node. For forward mode, it propagates from left to
   * right. For reverse mode, it propagates from right to left.
   */
  private readonly nodeIdToDerivatives = new Map<string, string>();

  getNodes(): CoreNode[] {
    return Array.from(this.nodeIdToNodes.values());
  }

  getNodeType(nodeId: string): NodeType {
    const node = this.getOneNode(nodeId);
    return node.getType();
  }

  getOneNode(nodeId: string): CoreNode {
    const node = this.nodeIdToNodes.get(nodeId);
    if (node === undefined) {
      throw new Error(`Node ${nodeId} doesn't exist`);
    }
    return node;
  }

  hasNode(nodeId: string): boolean {
    return this.nodeIdToNodes.has(nodeId);
  }

  addNode(node: CoreNode): void {
    const nodeId = node.getId();
    if (this.hasNode(nodeId)) {
      throw new Error(`Node ${nodeId} already exists`);
    }
    this.nodeIdToNodes.set(node.getId(), node);
  }

  removeNode(nodeId: string): void {
    const node = this.getOneNode(nodeId);
    this.removeNodeConnections(node);

    const success = this.nodeIdToNodes.delete(nodeId);
    if (!success) {
      throw new Error(`Node ${nodeId} doesn't exist`);
    }
  }

  validateConnect(node1Id: string, node2Id: string, node2PortId: string): void {
    const node2 = this.getOneNode(node2Id);

    try {
      node2.getRelationship().validateAddInputNodeByPort(node2PortId, node1Id);
    } catch (error) {
      if (error instanceof InputNodeAlreadyConnectedError) {
        throw new InputNodeAlreadyConnectedError(
          `Input node ${node1Id} is already connected to node ${node2Id} by \
port ${node2PortId}`,
          node1Id,
          node2PortId,
          node2Id,
        );
      } else if (error instanceof InputPortFullError) {
        throw new InputPortFullError(
          `Input port ${node2PortId} of node ${node2Id} doesn't allow \
multiple edges`,
          node2PortId,
          node2Id,
        );
      } else {
        throw error;
      }
    }

    if (this.canVisit(node2Id, node1Id)) {
      throw new CycleError(
        `Connecting node ${node1Id} to node ${node2Id} would cause a cycle`,
        node1Id,
        node2Id,
      );
    }
  }

  connect(node1Id: string, node2Id: string, node2PortId: string): void {
    const node1 = this.getOneNode(node1Id);
    const node2 = this.getOneNode(node2Id);

    this.validateConnect(node1Id, node2Id, node2PortId);

    // Could throw error, do it first
    node2.getRelationship().addInputNodeByPort(node2PortId, node1);

    node1.getRelationship().addOutputNode(node2);
  }

  disconnect(node1Id: string, node2Id: string, node2PortId: string): void {
    const node1 = this.getOneNode(node1Id);
    const node2 = this.getOneNode(node2Id);
    node1.getRelationship().removeOutputNode(node2Id);
    node2.getRelationship().removeInputNodeByPort(node2PortId, node1Id);
  }

  getDifferentiationMode(): DifferentiationMode {
    return this.differentiationMode;
  }

  setDifferentiationMode(mode: DifferentiationMode): void {
    this.nodeIdToDerivatives.clear();
    this.differentiationMode = mode;
  }

  getNodeValue(nodeId: string): string {
    const node = this.getOneNode(nodeId);
    return node.getValue();
  }

  hasNodeDerivative(nodeId: string): boolean {
    return this.nodeIdToDerivatives.has(nodeId);
  }

  getNodeDerivative(nodeId: string): string {
    const derivative = this.nodeIdToDerivatives.get(nodeId);
    if (derivative === undefined) {
      return "0";
    }
    return derivative;
  }

  setNodeValue(nodeId: string, value: string): void {
    const node = this.getOneNode(nodeId);
    node.setValue(value);
  }

  getTargetNode(): string | null {
    return this.targetNodeId;
  }

  setTargetNode(nodeId: string | null): void {
    if (nodeId !== null) {
      this.getOneNode(nodeId); // checks if the node exists
    }

    this.nodeIdToDerivatives.clear();
    this.targetNodeId = nodeId;
  }

  /**
   * Updates all f() values.
   *
   * We can use the multi-output graph as an example:
   * - op2=f(v3,v2)
   * - op1=f(v2,v1)
   * - op3=v4
   * - op4=f(op2(),op1(),op3())
   * - op5=f(op1(),op3())
   *
   * The algorithm runs as follows:
   * 1. Find all terminal nodes: op4 and op5
   * 2. Perform a topological sort from the terminal nodes toward its input
   *    nodes to find nodes in reverse order, a valid order could be
   *    [v1,v2,v3,v4,op1,op2,op3,op4,op5] or
   *    [v4,v3,v2,v1,op3,op2,op1,op5,op4].
   * 3. Update f() for nodes in the topological sort result
   *
   * @returns Node IDs of all nodes that have their f() updated.
   */
  updateFValues(): string[] {
    // Step 1
    const terminalNodeIds = this.getTerminalNodeIds();

    // Step 2
    const topologicalOrderedNodeIds = this.topologicalSort(
      terminalNodeIds,
      "TO_INPUT",
    );

    // Step 3
    const updatedNodeIds: string[] = [];
    topologicalOrderedNodeIds.forEach((nodeId) => {
      const node = this.getOneNode(nodeId);
      node.updateF();
      updatedNodeIds.push(nodeId);
    });
    return updatedNodeIds;
  }

  /**
   * Updates all derivatives.
   *
   * We can use the multi-output graph as an example:
   * - op2=f(v3,v2)
   * - op1=f(v2,v1)
   * - op3=v4
   * - op4=f(op2(),op1(),op3())
   * - op5=f(op1(),op3())
   *
   * The algorithm runs as follows:
   * 1. Remove all previous derivative results
   * 2. Return if the target node is null
   * 3. Perform a topological sort from the target node toward its output nodes
   *    (forward mode) or input nodes (reverse mode) based on the
   *    differentiation mode. The topological sort result will be in reverse
   *    order. For example, if the target node is op4 and the differentiation
   *    mode is reverse, a valid order could be
   *    [v1,v2,v3,v4,op1,op2,op3,op4] or
   *    [v4,v3,v2,v1,op3,op2,op1,op4]. If the target node is v2 and the
   *    differentiation mode is forward, a valid order could be
   *    [op4,op5,op1,op2,v2] or [op5,op4,op2,op1,v2].
   * 4. Update derivatives for nodes in the topological sort result in reverse
   *    order because we want to visit from the target node first
   *
   * @returns Node IDs of all nodes that have their derivatives updated.
   */
  updateDerivatives(): string[] {
    // Step 1
    this.nodeIdToDerivatives.clear();

    // Step 2
    if (this.targetNodeId === null) {
      return [];
    }

    // Step 3
    const direction: NeighborDirection =
      this.differentiationMode === "FORWARD" ? "TO_OUTPUT" : "TO_INPUT";
    const topologicalOrderedNodeIds = this.topologicalSort(
      [this.targetNodeId],
      direction,
    );

    // Step 4
    const updatedNodeIds: string[] = [];
    for (let i = topologicalOrderedNodeIds.length - 1; i >= 0; i--) {
      const nodeId = topologicalOrderedNodeIds[i];
      const node = this.getOneNode(nodeId);
      const derivative = this.calculateNodeDerivative(node);
      this.nodeIdToDerivatives.set(node.getId(), derivative);
      updatedNodeIds.push(nodeId);
    }
    return updatedNodeIds;
  }

  /**
   * Explains chain rule.
   *
   * The data will only be correct after the f values and derivative values are
   * updated.
   *
   * We can use some nodes in the medium graph as an example:
   * sum1=f(v1,v2)
   * sum2=f(v2,c1)
   *
   * In forward mode, chain rule for sum1 is:
   * d(sum1)/d(target) = d(v1)/d(target) * d(sum1)/d(v1) +
   * d(v2)/d(target) * d(sum1)/d(v2)
   *
   * In reverse mode, chain rule for v2 is:
   * d(target)/d(v2) = d(sum1)/d(v2) * d(target)/d(sum1) +
   * d(sum2)/d(v2) * d(target)/d(sum2)
   *
   * @param currentNodeId Current node ID, e.g., v2 or sum1 in the above
   * examples.
   * @returns List of chain rule terms. Each term represents
   * d(neighbor)/d(target) * d(current)/d(neighbor) for forward mode or
   * d(neighbor)/d(current) * d(target)/d(neighbor) for reverse mode.
   */
  explainChainRule(currentNodeId: string): ChainRuleTerm[] {
    const currentNode = this.getOneNode(currentNodeId);
    const direction: NeighborDirection =
      this.differentiationMode === "FORWARD" ? "TO_INPUT" : "TO_OUTPUT";
    const neighborNodeIds = this.getNeighborNodeIds(currentNode, direction);
    return neighborNodeIds.map((neighborNodeId) => {
      const derivativeRegardingTarget = this.getNodeDerivative(neighborNodeId);
      const neighborNode = this.getOneNode(neighborNodeId);
      const derivativeRegardingCurrent =
        this.differentiationMode === "FORWARD"
          ? currentNode.calculateDfdx(neighborNode)
          : neighborNode.calculateDfdx(currentNode);
      return {
        neighborNodeId,
        derivativeRegardingTarget,
        derivativeRegardingCurrent,
      };
    });
  }

  /**
   * Checks if we can visit the node y from node x in an acyclic graph.
   *
   * The algorithm runs as follows:
   * 1. Visit all nodes from node x by DFS
   * 2. If we can visit node y, return true
   * 3. Otherwise, return false
   *
   * @param fromNodeId Node ID of node x.
   * @param toNodeId Node ID of node y.
   * @returns Whether we can visit from node x to node y.
   */
  private canVisit(fromNodeId: string, toNodeId: string): boolean {
    if (fromNodeId === toNodeId) {
      return true;
    }

    const nodeIdsToVisit: string[] = [fromNodeId];
    const visitedNodeIds = new Set<string>();
    while (nodeIdsToVisit.length > 0) {
      const nodeId = nodeIdsToVisit.pop();
      if (nodeId === undefined) {
        throw new Error(`The stack shouldn't be empty`);
      }
      const node = this.getOneNode(nodeId);
      const outputNodes = node.getRelationship().getOutputNodes();
      for (let i = 0; i < outputNodes.length; i++) {
        const outputNode = outputNodes[i];
        if (visitedNodeIds.has(outputNode.getId())) {
          continue;
        }

        if (outputNode.getId() === toNodeId) {
          return true;
        }

        nodeIdsToVisit.push(outputNode.getId());
        visitedNodeIds.add(outputNode.getId());
      }
    }

    return false;
  }

  /**
   * Removes connections of a node to all its neighboring nodes.
   * @param node The node to remove the input/output connections.
   */
  private removeNodeConnections(node: CoreNode): void {
    this.removeInputNodeConnections(node);
    this.removeOutputNodeConnections(node);
  }

  /**
   * Removes connections of a node to all its input nodes.
   * @param node The node to remove the input connections.
   */
  private removeInputNodeConnections(node: CoreNode): void {
    const nodeRelationship = node.getRelationship();
    nodeRelationship.inputPorts.forEach((inputPort) => {
      nodeRelationship
        .getInputNodesByPort(inputPort.getId())
        .forEach((inputNode) => {
          this.disconnect(inputNode.getId(), node.getId(), inputPort.getId());
        });
    });
  }

  /**
   * Removes connections of a node to all its output nodes.
   * @param node The node to remove the output connections.
   */
  private removeOutputNodeConnections(node: CoreNode): void {
    node
      .getRelationship()
      .getOutputNodes()
      .forEach((outputNode) => {
        // The node may connect to more than one port of the output node, so we
        // need to check every input port of the output node
        const outputNodeRelationship = outputNode.getRelationship();
        outputNodeRelationship.inputPorts.forEach((outputNodeInputPort) => {
          if (
            !outputNodeRelationship.hasInputNodeByPort(
              outputNodeInputPort.getId(),
              node.getId(),
            )
          ) {
            return;
          }

          this.disconnect(
            node.getId(),
            outputNode.getId(),
            outputNodeInputPort.getId(),
          );
        });
      });
  }

  /**
   * Calculates the node derivative.
   *
   * It uses chain rule to update the derivatives. For results to be correct,
   * the order of visiting the nodes must follow the topological sort order.
   *
   * @param node The node to calculate the derivative.
   * @returns The derivative of the node. That is, d(node)/d(targetNode) for
   * forward differentiation mode and d(targetNode)/d(node) for reverse
   * differentiation mode.
   */
  private calculateNodeDerivative(node: CoreNode): string {
    if (node.getId() === this.targetNodeId) {
      // d(node)/d(node) = 1 (non-constant) or 0 (constant)
      return node.calculateDfdx(node);
    }

    let totalDerivative = 0;
    if (this.differentiationMode === "FORWARD") {
      // Update d(node)/d(targetNode) for forward mode
      node
        .getRelationship()
        .getInputNodes()
        .forEach((inputNode) => {
          // d(inputNode)/d(targetNode)
          const derivative1 = this.getNodeDerivative(inputNode.getId());
          // d(node)/d(inputNode)
          const derivative2 = node.calculateDfdx(inputNode);
          // d(node)/d(targetNode) = d(inputNode)/d(targetNode) *
          // d(node)/d(inputNode) (chain rule)
          // TODO(sc420): Allow customization of product
          totalDerivative += parseFloat(derivative1) * parseFloat(derivative2);
        });
    } else {
      // Update d(targetNode)/d(node) for reverse mode
      node
        .getRelationship()
        .getOutputNodes()
        .forEach((outputNode) => {
          // d(outputNode)/d(node)
          const derivative1 = outputNode.calculateDfdx(node);
          // d(targetNode)/d(outputNode)
          const derivative2 = this.getNodeDerivative(outputNode.getId());
          // d(targetNode)/d(node) = d(outputNode)/d(node) *
          // d(targetNode)/d(outputNode)
          // TODO(sc420): Allow customization of product
          totalDerivative += parseFloat(derivative1) * parseFloat(derivative2);
        });
    }
    return `${totalDerivative}`;
  }

  /**
   * Performs a topological sort on the graph.
   *
   * We use DFS variant of the topological sort algorithm on wiki. Since the
   * graph is acyclic, we can ignore temporary marks. The recursive algorithm
   * can be written as follows:
   *
   * L ← Empty list that will contain the sorted nodes
   * while exists nodes without a permanent mark do // (1)
   *     select an unmarked node n
   *     visit(n) // (2)
   *
   * function visit(node n)
   *     if n has a permanent mark then // (3)
   *         return
   *
   *     for each node m with an edge from n to m do // (4)
   *         visit(m)
   *
   *     mark n with a permanent mark // (5)
   *     add n to head of L // (6)
   *
   * We can maintain our own call stack to simulate the recursion in the above
   * code. Each element in the call stack stores (n, hasVisitedDependents) to
   * represent the next position to execute in the above recursive algorithm.
   * When hasVisitedDependents==false, it's ready to run at the position (3).
   * When hasVisitedDependents==true, it's ready to run at the position (5).
   *
   * We use a set markedPermanent to record nodes that have executed at the
   * position (5).
   *
   * Initially, each node from the startNodeIds is added to the call stack with
   * hasVisitedDependents set to false if it the node is not in the set
   * markedPermanent. It represents the positions (1) and (2). Other nodes not
   * in startNodeIds are the nodes we don't care about, so we don't need to
   * call visit() on them.
   *
   * Then, we iterate through all dependent nodes of node n by the topological
   * sort direction. The direction should not be confused with differentiation
   * mode since it knows nothing about differentiation. We add these dependent
   * nodes to the call stack with hasVisitedDependents set to false initially
   * just like startNodeIds. It represents the position (4). To make sure we
   * know the node is ready to execute at the position (5) later, we push
   * (n, hasVisitedDependents==true) to the call stack before adding dependent
   * nodes to the call stack.
   *
   * Later, when we pop an element from the call stack and see
   * hasVisitedDependents is true, we add the node n to the set markedPermanent
   * and add the node n to the output list L. It represents the positions (5)
   * and (6).
   *
   * NOTE: The result is reversed because prepend operation for array is O(n),
   * but append operation is amortized O(1) which is more efficient. If you
   * want it in the classic order, just reverse the list.
   *
   * References:
   * - https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search
   *
   * @param startNodeIds List of node IDs of the starting nodes (unmarked
   * nodes).
   * @returns List of node IDs in reverse topological order.
   */
  private topologicalSort(
    startNodeIds: string[],
    direction: NeighborDirection,
  ): string[] {
    const callStack: TopologicalSortCallStackElement[] = [];
    const markedPermanent = new Set<string>();
    const reverseResult: string[] = [];

    // Call visit() for the root nodes (not depending on other nodes) (1) (2)
    startNodeIds.forEach((startNodeId) => {
      // Check if it has permanent mark (1)
      if (markedPermanent.has(startNodeId)) {
        return;
      }

      // Call visit() for the root node (2)
      callStack.push({
        nodeId: startNodeId,
        hasVisitedDependents: false,
      });
      while (callStack.length > 0) {
        const callStackElem = callStack.pop();
        if (callStackElem === undefined) {
          throw new Error("The call stack shouldn't be empty");
        }

        // Is it ready to execute the position (3) or (5)?
        if (!callStackElem.hasVisitedDependents) {
          // Ready to execute at the position (3)

          // Check if the node n has permanent mark (3)
          if (markedPermanent.has(callStackElem.nodeId)) {
            continue;
          }

          // Make sure the node n will execute at the position (5) later
          callStack.push({
            nodeId: callStackElem.nodeId,
            hasVisitedDependents: true,
          });

          // Call visit() for each dependent node (4)
          const node = this.getOneNode(callStackElem.nodeId);
          const dependentNodeIds = this.getNeighborNodeIds(node, direction);
          dependentNodeIds.forEach((dependentNodeId) => {
            callStack.push({
              nodeId: dependentNodeId,
              hasVisitedDependents: false,
            });
          });
        } else {
          // Ready to execute at the position (5)

          // Mark the node n with a permanent mark (5)
          markedPermanent.add(callStackElem.nodeId);
          // Add node n to the result (6)
          reverseResult.push(callStackElem.nodeId);
        }
      }
    });

    return reverseResult;
  }

  /**
   * Gets terminal node (nodes that don't have any output nodes) IDs.
   * @returns List of terminal node IDs.
   */
  private getTerminalNodeIds(): string[] {
    const terminalNodeIds: string[] = [];
    this.getNodes().forEach((node) => {
      if (node.getRelationship().isOutputPortEmpty()) {
        terminalNodeIds.push(node.getId());
      }
    });
    return terminalNodeIds;
  }

  /**
   * Gets the neighboring nodes of a node x by following the direction.
   * @param node The node x.
   * @param direction Direction.
   * @returns Neighboring node IDs in the direction.
   */
  private getNeighborNodeIds(
    node: CoreNode,
    direction: NeighborDirection,
  ): string[] {
    let neighborNodes: CoreNode[] = [];
    if (direction === "TO_INPUT") {
      neighborNodes = node.getRelationship().getInputNodes();
    } else {
      neighborNodes = node.getRelationship().getOutputNodes();
    }
    return neighborNodes.map((node) => node.getId());
  }
}

export default Graph;
