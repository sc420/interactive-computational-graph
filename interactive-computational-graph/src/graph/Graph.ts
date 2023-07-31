import type DifferentiationMode from "./DifferentiationMode";
import type GraphNode from "./GraphNode";

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

  // TODO(sc420): Consider the use case and return updated nodes when appropriate
  /**
   * When either the differentiation mode or the target node is changed, we
   * should invalidate the old derivatives and record the invalidated nodes.
   * These invalidated nodes should be returned when the next update() is
   * called to let users know these nodes have been invalidated.
   */
  private readonly invalidatedNodeIds = new Set<string>();

  /**
   * When update() is called, we should start updating f() values from these
   * nodes since the connections have been changed.
   */
  private readonly nodeIdsToUpdateF = new Set<string>();

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

    // When one input changes, it could update f() of node 2
    this.nodeIdsToUpdateF.add(node2Id);
  }

  disconnect(node1Id: string, node2Id: string, node2PortId: string): void {
    this.invalidateDerivativesFromDisconnectedNode(node2Id);

    const node1 = this.getOneNode(node1Id);
    const node2 = this.getOneNode(node2Id);
    node1.getRelationship().removeOutputNode(node2Id);
    node2.getRelationship().removeInputNodeByPort(node2PortId, node1Id);

    // When one input changes, it could update f() of node 2
    this.nodeIdsToUpdateF.add(node2Id);
  }

  setDifferentiationMode(mode: DifferentiationMode): void {
    this.invalidateDerivativesFromTargetNode();

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

    // When the node value changes, it could update f() of all its output nodes
    node
      .getRelationship()
      .getOutputNodes()
      .forEach((outputNode) => {
        this.nodeIdsToUpdateF.add(outputNode.getId());
      });
  }

  getTargetNode(): string | null {
    return this.targetNodeId;
  }

  setTargetNode(nodeId: string | null): void {
    if (nodeId !== null) {
      this.getOneNode(nodeId); // checks if the node exists
    }

    this.invalidateDerivativesFromTargetNode();

    this.targetNodeId = nodeId;
  }

  update(): Set<string> {
    const updatedFNodes = this.updateF();
    const updatedDerivativeNodes = this.updateDerivatives();
    const updatedNodes = new Set<string>([
      ...this.invalidatedNodeIds,
      ...updatedFNodes,
      ...updatedDerivativeNodes,
    ]);

    this.invalidatedNodeIds.clear();

    return updatedNodes;
  }

  private updateF(): Set<string> {
    const nodeIdsToBeUpdated: Set<string> = this.nodeIdsToUpdateF;
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

      const neighborNodeIds = this.getDifferentiationNeighborNodeIds(nodeId);
      neighborNodeIds.forEach((neighborNodeId) => {
        if (updatedNodeIds.has(neighborNodeId)) {
          return;
        }
        nodeIdsToBeUpdated.add(neighborNodeId);
      });
    }

    this.nodeIdsToUpdateF.clear();

    return updatedNodeIds;
  }

  private updateDerivatives(): Set<string> {
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

      const neighborNodeIds = this.getDifferentiationNeighborNodeIds(nodeId);
      neighborNodeIds.forEach((neighborNodeId) => {
        if (updatedNodeIds.has(neighborNodeId)) {
          return;
        }
        nodeIdsToBeUpdated.add(neighborNodeId);
      });
    }

    return updatedNodeIds;
  }

  private invalidateDerivativesFromTargetNode(): void {
    if (this.targetNodeId !== null) {
      this.invalidateDerivativesFromNode(this.targetNodeId).forEach(
        (invalidatedNode) => {
          this.invalidatedNodeIds.add(invalidatedNode);
        },
      );
    }
  }

  private invalidateDerivativesFromDisconnectedNode(node2Id: string): void {
    if (this.differentiationMode === "FORWARD") {
      // The sibling nodes of node1 won't be affected because the chain rule of
      // other sibling nodes only involve nodes of either the sibling nodes
      // themselves or the input nodes of the sibling nodes
      this.invalidateDerivativesFromNode(node2Id).forEach((invalidatedNode) => {
        this.invalidatedNodeIds.add(invalidatedNode);
      });
    } else {
      // It could affect the derivatives of other sibling nodes of node1
      // because the chain rule of other sibling nodes involve
      // d(node2)/d(siblingNode). When d(node2)/d(siblingNode) involves node1,
      // the derivative will change (e.g., node2 is product operation), so we
      // should invalidate from node2 instead of node1
      this.invalidateDerivativesFromNode(node2Id).forEach((invalidatedNode) => {
        this.invalidatedNodeIds.add(invalidatedNode);
      });
    }
  }

  private invalidateDerivativesFromNode(nodeId: string): Set<string> {
    const nodeIdsToBeUpdated = new Set<string>([nodeId]);
    const updatedNodeIds = new Set<string>();
    while (nodeIdsToBeUpdated.size > 0) {
      const nodeId = Graph.popFromSet(nodeIdsToBeUpdated);
      if (nodeId === undefined) {
        throw new Error("Should have at least one node in the queue");
      }

      // Invalidate
      this.nodeIdToDerivatives.delete(nodeId);
      updatedNodeIds.add(nodeId);

      const neighborNodeIds = this.getDifferentiationNeighborNodeIds(nodeId);
      neighborNodeIds.forEach((neighborNodeId) => {
        if (updatedNodeIds.has(neighborNodeId)) {
          return;
        }
        nodeIdsToBeUpdated.add(neighborNodeId);
      });
    }

    return updatedNodeIds;
  }

  private getDifferentiationNeighborNodeIds(nodeId: string): Set<string> {
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
