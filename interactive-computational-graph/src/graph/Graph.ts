import type DifferentiationMode from "./DifferentiationMode";
import type GraphNode from "./GraphNode";

type TopologicalSortDirection = "TO_OUTPUT" | "TO_INPUT";

interface TopologicalSortCallStackElement {
  nodeId: string;
  allDependentsVisited: boolean;
}

class Graph {
  private readonly nodeIdToNodes = new Map<string, GraphNode>();

  private differentiationMode: DifferentiationMode = "REVERSE";

  private targetNodeId: string | null = null;

  /**
   * Records the valid derivatives for all the nodes that are propagated from
   * the current target node. For forward mode, it propagates from left to
   * right. For reverse mode, it propagates from right to left.
   */
  private readonly nodeIdToDerivatives = new Map<string, number>();

  getNodes(): GraphNode[] {
    return Array.from(this.nodeIdToNodes.values());
  }

  getOneNode(nodeId: string): GraphNode {
    const node = this.nodeIdToNodes.get(nodeId);
    if (node === undefined) {
      throw new Error(`Node ${nodeId} doesn't exist`);
    }
    return node;
  }

  hasNode(nodeId: string): boolean {
    return this.nodeIdToNodes.has(nodeId);
  }

  addNode(node: GraphNode): void {
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

  connect(node1Id: string, node2Id: string, node2PortId: string): void {
    const node1 = this.getOneNode(node1Id);
    const node2 = this.getOneNode(node2Id);

    if (!node2.getRelationship().canAddInputNodeByPort(node2PortId)) {
      throw new Error(
        `Couldn't add to input port ${node2PortId} of node ${node2Id},
 please check if the port allows multiple edges`,
      );
    }

    if (this.canVisit(node2Id, node1Id)) {
      throw new Error(
        `Connecting node ${node1Id} to node ${node2Id} would cause a cycle`,
      );
    }

    node1.getRelationship().addOutputNode(node2);
    node2.getRelationship().addInputNodeByPort(node2PortId, node1);
  }

  disconnect(node1Id: string, node2Id: string, node2PortId: string): void {
    const node1 = this.getOneNode(node1Id);
    const node2 = this.getOneNode(node2Id);
    node1.getRelationship().removeOutputNode(node2Id);
    node2.getRelationship().removeInputNodeByPort(node2PortId, node1Id);
  }

  setDifferentiationMode(mode: DifferentiationMode): void {
    this.nodeIdToDerivatives.clear();
    this.differentiationMode = mode;
  }

  getNodeValue(nodeId: string): number {
    const node = this.getOneNode(nodeId);
    return node.getValue();
  }

  getNodeDerivative(nodeId: string): number {
    const derivative = this.nodeIdToDerivatives.get(nodeId);
    if (derivative === undefined) {
      return 0;
    }
    return derivative;
  }

  setNodeValue(nodeId: string, value: number): void {
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
    const topologicalSortDirection: TopologicalSortDirection =
      this.differentiationMode === "FORWARD" ? "TO_OUTPUT" : "TO_INPUT";
    const topologicalOrderedNodeIds = this.topologicalSort(
      [this.targetNodeId],
      topologicalSortDirection,
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
  private removeNodeConnections(node: GraphNode): void {
    this.removeInputNodeConnections(node);
    this.removeOutputNodeConnections(node);
  }

  /**
   * Removes connections of a node to all its input nodes.
   * @param node The node to remove the input connections.
   */
  private removeInputNodeConnections(node: GraphNode): void {
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
  private removeOutputNodeConnections(node: GraphNode): void {
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
  private calculateNodeDerivative(node: GraphNode): number {
    if (node.getId() === this.targetNodeId) {
      // d(node)/d(node) = 1 (non-constant) or 0 (constant)
      return node.calculateDfdy(node);
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
          const derivative2 = node.calculateDfdy(inputNode);
          // d(node)/d(targetNode) = d(inputNode)/d(targetNode) *
          // d(node)/d(inputNode) (chain rule)
          totalDerivative += derivative1 * derivative2;
        });
    } else {
      // Update d(targetNode)/d(node) for reverse mode
      node
        .getRelationship()
        .getOutputNodes()
        .forEach((outputNode) => {
          // d(outputNode)/d(node)
          const derivative1 = outputNode.calculateDfdy(node);
          // d(targetNode)/d(outputNode)
          const derivative2 = this.getNodeDerivative(outputNode.getId());
          // d(targetNode)/d(node) = d(outputNode)/d(node) *
          // d(targetNode)/d(outputNode)
          totalDerivative += derivative1 * derivative2;
        });
    }
    return totalDerivative;
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
   * code. Each element in the call stack stores (n, allDependentsVisited) to
   * represent the position in the above recursive algorithm. We have another
   * set visitedNodes to record nodes that have reached the position (5).
   *
   * Initially, all nodes in startNodes are added to the call stack with
   * allDependentsVisited set to false. It represents the positions (1) and
   * (2). Other nodes not in startNodes are the nodes we don't care about, so
   * we don't need to call visit() on them.
   *
   * Instead of checking if the node is in the set visitedNodes when we pop an
   * element from the call stack, we move the check earlier when we call
   * visit() recursively in position (4).
   *
   * Then, we iterate through all dependent nodes of node n by the topological
   * sort direction. We add these dependent nodes to the call stack with
   * allDependentsVisited set to false initially just like startNodes. It
   * should not be confused with differentiation mode. It represents the
   * position (4). To make sure we know the node has reached position (5)
   * later, we push (n, allDependentsVisited==true) to the call stack before
   * adding dependent nodes.
   *
   * Later, when we pop an element from the stack and see that
   * allDependentsVisited is true, we add the node n to the set visitedNodes
   * and output the node n to the list L. It represents the positions (5) and
   * (6).
   *
   * NOTE: The results is reversed because prepend operation for array is O(n),
   * but append operation is amortized O(1) which is more efficient. If you
   * want it in the classic order, just reverse the list.
   *
   * References:
   * - https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search
   *
   * @param startNodes List of starting nodes (unmarked nodes).
   * @returns List of Node IDs in reverse topological order.
   */
  private topologicalSort(
    startNodeIds: string[],
    direction: TopologicalSortDirection,
  ): string[] {
    const callStack: TopologicalSortCallStackElement[] = [];
    // Call visit() for the root nodes (not depending on other nodes) (1) (2)
    startNodeIds.forEach((startNodeId) => {
      callStack.push({
        nodeId: startNodeId,
        allDependentsVisited: false,
      });
    });

    const visitedNodeIds = new Set<string>();
    const reverseResult: string[] = [];
    while (callStack.length > 0) {
      const callStackElem = callStack.pop();
      if (callStackElem === undefined) {
        throw new Error("The call stack shouldn't be empty");
      }

      const node = this.getOneNode(callStackElem.nodeId);
      if (!callStackElem.allDependentsVisited) {
        // Make sure the node n will be visited again after all dependents are
        // visited
        callStack.push({
          nodeId: callStackElem.nodeId,
          allDependentsVisited: true,
        });

        const dependentNodeIds = this.getTopologicalSortDirectionNodeIds(
          node,
          direction,
        );
        dependentNodeIds.forEach((dependentNodeId) => {
          // Check if the dependent node has been visited (3)
          if (visitedNodeIds.has(dependentNodeId)) {
            return;
          }

          // Call visit() on the dependent node (4)
          callStack.push({
            nodeId: dependentNodeId,
            allDependentsVisited: false,
          });
        });
      } else {
        // Mark the node as visited (5)
        visitedNodeIds.add(callStackElem.nodeId);
        // Add node to the results (6)
        reverseResult.push(callStackElem.nodeId);
      }
    }

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
   * Gets the neighboring nodes of a node x by following the topological sort
   * direction.
   * @param node The node x.
   * @param direction Topological sort direction.
   * @returns Neighboring node IDs in the topological sort direction.
   */
  private getTopologicalSortDirectionNodeIds(
    node: GraphNode,
    direction: TopologicalSortDirection,
  ): string[] {
    let neighborNodes: GraphNode[] = [];
    if (direction === "TO_INPUT") {
      neighborNodes = node.getRelationship().getInputNodes();
    } else {
      neighborNodes = node.getRelationship().getOutputNodes();
    }
    return neighborNodes.map((node) => node.getId());
  }
}

export default Graph;
