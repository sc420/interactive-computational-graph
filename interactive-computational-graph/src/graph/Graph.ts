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

  updateFValues(): Set<string> {
    return new Set<string>(); // TODO(sc420)
  }

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
