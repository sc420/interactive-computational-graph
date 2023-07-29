import type DifferentiationMode from "./DifferentiationMode";
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
    // TODO(sc420)
  }

  disconnect(node1Id: string, node2Id: string, node2PortId: string): void {
    // TODO(sc420)
  }

  setDifferentiationMode(mode: DifferentiationMode): void {
    // TODO(sc420)
  }

  getNodeValue(nodeId: string): number {
    // TODO(sc420)
    return 0;
  }

  getNodeDfdy(nodeId: string): number {
    // TODO(sc420)
    return 0;
  }

  setNodeValue(nodeId: string, value: number): void {
    // TODO(sc420)
  }

  getTargetNode(): string {
    // TODO(sc420)
    return "";
  }

  setTargetNode(nodeId: string): void {
    // TODO(sc420)
  }

  update(): string[] {
    // TODO(sc420): update from dirty nodes
    return [];
  }

  private updateF(): string[] {
    // TODO(sc420): update from dirty nodes
    return [];
  }

  private updateDfdy(): string[] {
    // TODO(sc420): update from dirty nodes
    return [];
  }
}

export default Graph;
