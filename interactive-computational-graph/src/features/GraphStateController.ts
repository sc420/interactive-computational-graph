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
import { constantType, variableType } from "./KnownNodeTypes";
import type NodeData from "./NodeData";
import type Operation from "./Operation";

class GraphStateController {
  private nextReactFlowId = 1;
  private nextOperationId = 1;
  private lastSelectedNodeId: string | null = null;

  changeNodes(changes: NodeChange[], nodes: Node[]): Node[] {
    return applyNodeChanges(changes, nodes);
  }

  changeEdges(changes: EdgeChange[], edges: Edge[]): Edge[] {
    return applyEdgeChanges(changes, edges);
  }

  updateSelectedNodes(nodes: Node[]): void {
    const firstNode = nodes.find((node) => "id" in node) ?? null;
    if (firstNode !== null) {
      this.lastSelectedNodeId = firstNode.id;
    }
  }

  connect(connection: Connection, edges: Edge[]): Edge[] {
    return addEdge(connection, edges);
  }

  dropNode(nodeType: string, position: XYPosition, nodes: Node[]): Node[] {
    nodes = this.deselectLastSelectedNode(nodes);
    const node = this.buildNode(nodeType, position);
    return nodes.concat(node);
  }

  addNode(nodeType: string, nodes: Node[]): Node[] {
    nodes = this.deselectLastSelectedNode(nodes);
    const position = this.getNewNodePosition(nodes);
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
      selected: true,
      position,
    };
  }

  private buildNodeData(nodeType: string, id: string): NodeData {
    switch (nodeType) {
      case constantType: {
        return {
          text: `c${id}`,
          nodeType,
          inputItems: [
            {
              id: "value",
              text: "=",
              showHandle: false,
              showInputField: true,
              value: "0",
            },
          ],
          outputItems: [],
        };
      }
      case variableType: {
        return {
          text: `v${id}`,
          nodeType,
          inputItems: [
            {
              id: "value",
              text: "=",
              showHandle: false,
              showInputField: true,
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
          text: `${nodeType}${id}`,
          nodeType,
          inputItems: [
            {
              id: "a",
              text: "a",
              showHandle: true,
              showInputField: false,
              value: "",
            },
            {
              id: "bb",
              text: "bb",
              showHandle: true,
              showInputField: true,
              value: "3",
            },
            {
              id: "x_i",
              text: "x_i",
              showHandle: true,
              showInputField: false,
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

  private getNewNodePosition(nodes: Node[]): XYPosition {
    const randomMin = -50;
    const randomMax = 50;
    let referenceNode: Node | null = null;
    // See if we can find the last selected node
    referenceNode = this.findLastSelectedNode(nodes);

    // Pick a random node. For this case, pick any node that has id since the
    // array may contain undefined value
    if (referenceNode === null) {
      referenceNode = nodes.find((node) => "id" in node) ?? null;
    }

    if (referenceNode !== null) {
      return {
        x: referenceNode.position.x + this.randomInteger(randomMin, randomMax),
        y: referenceNode.position.y + this.randomInteger(randomMin, randomMax),
      };
    } else {
      return {
        x: this.randomInteger(0, randomMax),
        y: this.randomInteger(0, randomMax),
      };
    }
  }

  private deselectLastSelectedNode(nodes: Node[]): Node[] {
    const node = this.findLastSelectedNode(nodes);
    if (node !== null) {
      node.selected = false;
    }
    return nodes;
  }

  private findLastSelectedNode(nodes: Node[]): Node | null {
    if (this.lastSelectedNodeId === null) {
      return null;
    }
    return nodes.find((node) => node.id === this.lastSelectedNodeId) ?? null;
  }

  private randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default GraphStateController;
