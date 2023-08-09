import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type XYPosition,
} from "reactflow";

class GraphStateController {
  private nextNodeId = 0;

  changeNodes(changes: NodeChange[], nodes: Node[]): Node[] {
    return applyNodeChanges(changes, nodes);
  }

  changeEdges(changes: EdgeChange[], edges: Edge[]): Edge[] {
    return applyEdgeChanges(changes, edges);
  }

  connect(connection: Connection, edges: Edge[]): Edge[] {
    return addEdge(connection, edges);
  }

  dropNode(nodeType: string, position: XYPosition, nodes: Node[]): Node[] {
    const newNode = {
      id: this.getNewNodeId(),
      type: "default", // TODO(sc420): pass type instead of default
      position,
      data: { label: `${nodeType} node` },
    };

    return nodes.concat(newNode);
  }

  addNode(nodeType: string, nodes: Node[]): Node[] {
    const newNode = {
      id: this.getNewNodeId(),
      type: "default", // TODO(sc420): pass type instead of default
      position: { x: 150, y: 150 },
      data: { label: `${nodeType} node` },
    };

    return nodes.concat(newNode);
  }

  private getNewNodeId(): string {
    return `${this.nextNodeId++}`;
  }
}

export default GraphStateController;
