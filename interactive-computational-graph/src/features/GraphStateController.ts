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
import type NodeData from "./NodeData";
import type Operation from "./Operation";

class GraphStateController {
  private nextReactFlowId = 1;
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
    const id = this.getNewReactFlowId();
    let newNode: Node;
    if (nodeType === "Sum" || nodeType === "Product") {
      const data: NodeData = {
        graphId: nodeType,
        reactFlowId: id,
        items: [
          {
            id: "a",
            label: "a",
            showInputHandle: true,
            readOnly: true,
            value: "",
          },
          {
            id: "bb",
            label: "bb",
            showInputHandle: true,
            readOnly: false,
            value: "3",
          },
          {
            id: "ccc",
            label: "ccc",
            showInputHandle: true,
            readOnly: true,
            value: "",
          },
        ],
      };
      newNode = {
        id,
        type: "operation",
        data,
        dragHandle: ".drag-handle",
        position,
      };
    } else {
      newNode = {
        id: this.getNewReactFlowId(),
        type: "default", // TODO(sc420): pass type instead of default
        data: { id, label: `${nodeType} node` },
        position,
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

  private getNewReactFlowId(): string {
    return `${this.nextReactFlowId++}`;
  }

  private getNewOperationId(): string {
    return `Custom ${this.nextOperationId++}`;
  }
}

export default GraphStateController;
