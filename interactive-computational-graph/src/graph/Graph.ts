import type GraphNode from "./GraphNode";

class Graph {
  private readonly nodeIdToNodes: Map<string, GraphNode> = new Map<
    string,
    GraphNode
  >();

  getNodes(): GraphNode[] {
    return Array.from(this.nodeIdToNodes.values());
  }

  getOneNode(nodeId: string): GraphNode {
    const node = this.nodeIdToNodes.get(nodeId);
    if (node === undefined) {
      throw new Error(`Node ID ${nodeId} doesn't exist`);
    }
    return node;
  }

  hasNode(nodeId: string): boolean {
    return this.nodeIdToNodes.has(nodeId);
  }

  addNode(node: GraphNode): void {
    const nodeId = node.getId();
    if (this.hasNode(nodeId)) {
      throw new Error(`Node ID ${nodeId} already exists`);
    }
    this.nodeIdToNodes.set(node.getId(), node);
  }

  removeNode(nodeId: string): void {
    const success = this.nodeIdToNodes.delete(nodeId);
    if (!success) {
      throw new Error(`Node ID ${nodeId} doesn't exist`);
    }
  }

  connect(nodeId1: string, nodeId2: string): void {
    // TODO(sc420)
  }

  disconnect(nodeId1: string, nodeId2: string): void {
    // TODO(sc420)
  }

  updateNodeValue(nodeId: string, value: number): void {
    // TODO(sc420)
  }

  updateTargetNode(nodeId: string): void {
    // TODO(sc420)
  }
}

export default Graph;
