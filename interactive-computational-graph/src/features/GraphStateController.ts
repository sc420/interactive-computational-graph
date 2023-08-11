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
import { TEMPLATE_DFDY_CODE, TEMPLATE_F_CODE } from "./BuiltInCode";
import type Operation from "./Operation";

class GraphStateController {
  private nextNodeId = 1;
  private nextOperationId = 1;

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
    let newNode: Node;
    if (nodeType === "Sum" || nodeType === "Product") {
      newNode = {
        id: this.getNewNodeId(),
        type: "operation",
        position,
        data: { inputPorts: ["a", "bb", "ccc"] },
      };
    } else {
      newNode = {
        id: this.getNewNodeId(),
        type: "default", // TODO(sc420): pass type instead of default
        position,
        data: { label: `${nodeType} node` },
      };
    }

    return nodes.concat(newNode);
  }

  addNode(nodeType: string, nodes: Node[]): Node[] {
    const position: XYPosition = { x: 150, y: 150 };
    return this.dropNode(nodeType, position, nodes);
  }

  addOperation(operations: Operation[]): Operation[] {
    const newOperation: Operation = {
      id: this.getNewOperationId(),
      category: "CUSTOM",
      fCode: TEMPLATE_F_CODE,
      dfdyCode: TEMPLATE_DFDY_CODE,
      inputPorts: [],
      helpText: "Write some Markdown and LaTeX here",
    };

    return operations.concat(newOperation);
  }

  private getNewNodeId(): string {
    return `${this.nextNodeId++}`;
  }

  private getNewOperationId(): string {
    return `Custom ${this.nextOperationId++}`;
  }
}

export default GraphStateController;
