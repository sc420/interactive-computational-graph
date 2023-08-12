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
    const node = this.buildNode(nodeType, position);
    return nodes.concat(node);
  }

  addNode(nodeType: string, nodes: Node[]): Node[] {
    const position: XYPosition = { x: 150, y: 150 };
    const node = this.buildNode(nodeType, position);
    return nodes.concat(node);
  }

  addOperation(operations: Operation[]): Operation[] {
    const id = this.getNewOperationId();
    const newOperation: Operation = {
      id,
      text: `Operation ${id}`,
      type: "CUSTOM",
      fCode: TEMPLATE_F_CODE,
      dfdyCode: TEMPLATE_DFDY_CODE,
      inputPorts: [],
      helpText: "Write some Markdown and LaTeX here",
    };

    return operations.concat(newOperation);
  }

  private buildNode(nodeType: string, position: XYPosition): Node {
    const reactFlowId = this.getNewReactFlowId();
    return {
      id: reactFlowId,
      type: "custom",
      data: this.buildNodeData(nodeType, reactFlowId),
      dragHandle: ".drag-handle",
      position,
    };
  }

  private buildNodeData(nodeType: string, id: string): NodeData {
    switch (nodeType) {
      case "_constant": {
        return {
          id,
          text: `c${id}`,
          inputItems: [
            {
              id: "value",
              text: "=",
              showHandle: false,
              readOnly: false,
              value: "0",
            },
          ],
          outputItems: [],
        };
      }
      case "_variable": {
        return {
          id,
          text: `v${id}`,
          inputItems: [
            {
              id: "value",
              text: "=",
              showHandle: false,
              readOnly: false,
              value: "0",
            },
          ],
          outputItems: [
            {
              id: "derivative",
              text: "d(y)/d(v) =",
              value: "5",
            },
          ],
        };
      }
      default: {
        // Operation
        return {
          id,
          text: `${nodeType}${id}`,
          inputItems: [
            {
              id: "a",
              text: "a",
              showHandle: true,
              readOnly: true,
              value: "",
            },
            {
              id: "bb",
              text: "bb",
              showHandle: true,
              readOnly: false,
              value: "3",
            },
            {
              id: "x_i",
              text: "x_i",
              showHandle: true,
              readOnly: true,
              value: "",
            },
          ],
          outputItems: [
            {
              id: "value",
              text: "=",
              value: "123",
            },
            {
              id: "derivative",
              text: "d(y)/d(x) =",
              value: "456",
            },
          ],
        };
      }
    }
  }

  private getNewReactFlowId(): string {
    return `${this.nextReactFlowId++}`;
  }

  private getNewOperationId(): string {
    return `Custom ${this.nextOperationId++}`;
  }
}

export default GraphStateController;
