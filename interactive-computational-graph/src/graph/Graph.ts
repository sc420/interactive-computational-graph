import type DifferentiationMode from "./DifferentiationMode";
import type GraphNode from "./GraphNode";

/**
 * A state for updating f(). It's similar to the call stack data.
 */
interface UpdateFState {
  nodeId: string;
  allInputFValuesUpdated: boolean;
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
    const success = this.nodeIdToNodes.delete(nodeId);
    if (!success) {
      throw new Error(`Node ${nodeId} doesn't exist`);
    }
  }

  connect(node1Id: string, node2Id: string, node2PortId: string): void {
    const node1 = this.getOneNode(node1Id);
    const node2 = this.getOneNode(node2Id);
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

    this.targetNodeId = nodeId;
  }

  /**
   * Update all f() values.
   *
   * The algorithm simulates recursive calls to the subfunctions. For example,
   * to calculate op1 = f(op2(),op3(),op4()), we call op2(), op3() and op4() to
   * update their f() values and finally call f() on op1. We use a stack
   * updateStates to represent the call stack.
   *
   * Since we use the top-down approach by working on right-hand side nodes
   * first, we should fill updateStates with terminal nodes first.
   *
   * It's as if we have written a recursive function like this:
   * function update(node) {
   *   node.getInputNodes().forEach((inputNode) => {  // (1)
   *     if (!updatedNodeIds.has(inputNode.getId())) {  // (2)
   *       update(inputNode);  // (3)
   *     }
   *   });
   *   node.updateF();  // (4)
   *   updatedNodeIds.add(node.getId());  // (5)
   * }
   *
   * and call update function initially:
   * terminalNodes.forEach((terminalNode) => {
   *   update(terminalNode);
   * });
   *
   * Before calling op2(), op3() and op4(), allInputFValuesUpdated is false,
   * which represents we're currently at (1). We then visit op2(), op3() and
   * op4() by adding them to the stack with allInputFValuesUpdated==false to
   * represent (3). After calling op2(), op3() and op4(),
   * allInputFValuesUpdated is true, which represents (4) and the f() is ready
   * to be called.
   *
   * Since it's possible to connect the output port of one node to multiple
   * nodes, we could visit the same input node multiple times. To avoid
   * duplicate f() call, we use a set updatedNodeIds to record a list of nodes
   * that have updated f(). It represents (2) and (5).
   *
   * @returns Node IDs of all nodes that have their f() updated.
   */
  updateFValues(): Set<string> {
    const updateStates: UpdateFState[] = this.getInitialUpdateStates();
    const updatedNodeIds = new Set<string>();
    while (updateStates.length > 0) {
      const curNodeState = updateStates.pop();
      if (curNodeState === undefined) {
        throw new Error("The stack shouldn't be empty");
      }

      const node = this.getOneNode(curNodeState.nodeId);
      if (curNodeState.allInputFValuesUpdated) {
        // Update f of the current node (4)
        node.updateF();
        // Mark the current node as updated (5)
        updatedNodeIds.add(curNodeState.nodeId);
      } else {
        // Make the current node ready to calculate f() when all input nodes
        // have been updated
        const readyNodeState: UpdateFState = {
          nodeId: curNodeState.nodeId,
          allInputFValuesUpdated: true,
        };
        updateStates.push(readyNodeState);

        // Update f of all input nodes (1)
        node
          .getRelationship()
          .getInputNodes()
          .forEach((inputNode) => {
            // Skip the input node if it has been updated (2)
            if (updatedNodeIds.has(inputNode.getId())) {
              return;
            }

            // Make the input node ready to be updated later (3)
            const inputNodeState: UpdateFState = {
              nodeId: inputNode.getId(),
              allInputFValuesUpdated: false,
            };
            updateStates.push(inputNodeState);
          });
      }
    }
    return updatedNodeIds;
  }

  // TODO(sc420): should use BFS
  updateFValuesFrom(startNodeId: string): Set<string> {
    const nodeIdsToBeUpdated = new Set<string>([startNodeId]);
    const updatedNodeIds = new Set<string>();
    while (nodeIdsToBeUpdated.size > 0) {
      const nodeId = Graph.popFromSet(nodeIdsToBeUpdated);
      if (nodeId === undefined) {
        throw new Error("Should have at least one node in the queue");
      }

      // Update f()
      const node = this.getOneNode(nodeId);
      node.updateF();
      updatedNodeIds.add(nodeId);

      const neighborNodeIds = this.getFDirectionNeighborNodeIds(nodeId);
      neighborNodeIds.forEach((neighborNodeId) => {
        if (updatedNodeIds.has(neighborNodeId)) {
          return;
        }
        nodeIdsToBeUpdated.add(neighborNodeId);
      });
    }

    return updatedNodeIds;
  }

  // TODO(sc420): should use BFS
  updateDerivatives(): Set<string> {
    if (this.targetNodeId === null) {
      return new Set<string>();
    }

    const nodeIdsToBeUpdated = new Set<string>([this.targetNodeId]);
    const updatedNodeIds = new Set<string>();
    while (nodeIdsToBeUpdated.size > 0) {
      const nodeId = Graph.popFromSet(nodeIdsToBeUpdated);
      if (nodeId === undefined) {
        throw new Error("Should have at least one node in the queue");
      }

      const node = this.getOneNode(nodeId);
      let totalDerivative = 0;
      if (nodeId === this.targetNodeId) {
        totalDerivative = node.calculateDfdy(node);
      } else {
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
      }
      this.nodeIdToDerivatives.set(nodeId, totalDerivative);
      updatedNodeIds.add(nodeId);

      const neighborNodeIds =
        this.getDerivativeDirectionNeighborNodeIds(nodeId);
      neighborNodeIds.forEach((neighborNodeId) => {
        if (updatedNodeIds.has(neighborNodeId)) {
          return;
        }
        nodeIdsToBeUpdated.add(neighborNodeId);
      });
    }

    return updatedNodeIds;
  }

  /**
   * Gets initial update states by finding all terminal nodes (nodes that don't
   * have any output nodes).
   *
   * @returns Initial update states of all terminal nodes.
   */
  private getInitialUpdateStates(): UpdateFState[] {
    const updateStates: UpdateFState[] = [];
    this.getNodes().forEach((node) => {
      if (node.getRelationship().isOutputPortEmpty()) {
        updateStates.push({
          nodeId: node.getId(),
          allInputFValuesUpdated: false,
        });
      }
    });
    return updateStates;
  }

  private getFDirectionNeighborNodeIds(nodeId: string): Set<string> {
    const node = this.getOneNode(nodeId);
    const neighborNodes = node.getRelationship().getOutputNodes();
    const neighborNodeIds = neighborNodes.map((node) => node.getId());
    return new Set<string>(neighborNodeIds);
  }

  private getDerivativeDirectionNeighborNodeIds(nodeId: string): Set<string> {
    const node = this.getOneNode(nodeId);
    let neighborNodes: GraphNode[] = [];
    if (this.differentiationMode === "FORWARD") {
      neighborNodes = node.getRelationship().getOutputNodes();
    } else {
      neighborNodes = node.getRelationship().getInputNodes();
    }
    const neighborNodeIds = neighborNodes.map((node) => node.getId());
    return new Set<string>(neighborNodeIds);
  }

  private static popFromSet(inputSet: Set<string>): string {
    const iterator = inputSet.values();
    const { value } = iterator.next();
    if (value === undefined) {
      throw new Error("The input set should be non-empty");
    }
    inputSet.delete(value);
    return value;
  }
}

export default Graph;
