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
import ConstantNode from "../core/ConstantNode";
import type CoreNode from "../core/CoreNode";
import Graph from "../core/Graph";
import Operation from "../core/Operation";
import OperationNode from "../core/OperationNode";
import VariableNode from "../core/VariableNode";
import { TEMPLATE_DFDY_CODE, TEMPLATE_F_CODE } from "./BuiltInCode";
import type FeatureOperation from "./FeatureOperation";
import { constantType, variableType } from "./KnownNodeTypes";
import type NodeData from "./NodeData";

type BodyClickCallback = (id: string) => void;

class GraphController {
  private readonly coreGraph = new Graph();

  private nextReactFlowId = 1;
  private nextFeatureOperationId = 1;
  private lastSelectedNodeId: string | null = null;

  private onBodyClick: BodyClickCallback | null = null;

  changeNodes(changes: NodeChange[], nodes: Node[]): Node[] {
    changes.forEach((change) => {
      switch (change.type) {
        case "remove": {
          this.removeCoreNode(change.id);
          break;
        }
      }
    });
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

  addNode(
    nodeType: string,
    featureOperations: FeatureOperation[],
    nodes: Node[],
  ): Node[] {
    const id = this.getNewReactFlowId();

    this.addCoreNode(nodeType, id, featureOperations);

    const position = this.getNewReactFlowNodePosition(nodes);
    return this.addReactFlowNode(
      nodeType,
      id,
      position,
      featureOperations,
      nodes,
    );
  }

  dropNode(
    nodeType: string,
    position: XYPosition,
    featureOperations: FeatureOperation[],
    nodes: Node[],
  ): Node[] {
    const id = this.getNewReactFlowId();

    this.addCoreNode(nodeType, id, featureOperations);

    return this.addReactFlowNode(
      nodeType,
      id,
      position,
      featureOperations,
      nodes,
    );
  }

  addOperation(featureOperations: FeatureOperation[]): FeatureOperation[] {
    const id = this.getNewFeatureOperationId();
    const newFeatureOperation: FeatureOperation = {
      id,
      text: `Operation ${id}`,
      type: "CUSTOM",
      operation: new Operation(TEMPLATE_F_CODE, TEMPLATE_DFDY_CODE),
      inputPorts: [],
      helpText: "Write some Markdown and LaTeX here",
    };

    return featureOperations.concat(newFeatureOperation);
  }

  handleBodyClick(id: string, nodes: Node[]): Node[] {
    return this.selectNode(id, nodes);
  }

  setOnBodyClick(callback: BodyClickCallback): void {
    this.onBodyClick = callback;
  }

  private addCoreNode(
    nodeType: string,
    id: string,
    featureOperations: FeatureOperation[],
  ): void {
    const coreNode = this.buildCoreNode(nodeType, id, featureOperations);
    this.coreGraph.addNode(coreNode);
  }

  private removeCoreNode(id: string): void {
    this.coreGraph.removeNode(id);
  }

  private addReactFlowNode(
    nodeType: string,
    id: string,
    position: XYPosition,
    featureOperations: FeatureOperation[],
    nodes: Node[],
  ): Node[] {
    nodes = this.deselectLastSelectedNode(nodes);
    const node = this.buildReactFlowNode(
      nodeType,
      id,
      position,
      featureOperations,
    );
    return nodes.concat(node);
  }

  private buildCoreNode(
    nodeType: string,
    id: string,
    featureOperations: FeatureOperation[],
  ): CoreNode {
    switch (nodeType) {
      case constantType: {
        return new ConstantNode(id);
      }
      case variableType: {
        return new VariableNode(id);
      }
      default: {
        // Operation
        const featureOperation = this.findFeatureOperation(
          nodeType,
          featureOperations,
        );
        return new OperationNode(
          id,
          featureOperation.inputPorts,
          featureOperation.operation,
        );
      }
    }
  }

  private buildReactFlowNode(
    nodeType: string,
    id: string,
    position: XYPosition,
    featureOperations: FeatureOperation[],
  ): Node {
    return {
      id,
      type: "custom", // registered in Graph
      data: this.buildReactFlowNodeData(nodeType, id, featureOperations),
      dragHandle: ".drag-handle", // corresponds to className in NoteTitle
      selected: true,
      position,
    };
  }

  private buildReactFlowNodeData(
    nodeType: string,
    id: string,
    featureOperations: FeatureOperation[],
  ): NodeData {
    const callOnBodyClick = (id: string): void => {
      this.onBodyClick?.(id);
    };

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
          onBodyClick: callOnBodyClick,
        };
      }
      case variableType: {
        const text = `v${id}`;
        return {
          text,
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
              text: `d(y)/d(${text}) =`,
              value: "5",
            },
          ],
          onBodyClick: callOnBodyClick,
        };
      }
      default: {
        // Operation
        const featureOperation = this.findFeatureOperation(
          nodeType,
          featureOperations,
        );

        const text = `${nodeType}${id}`;
        return {
          text,
          nodeType,
          inputItems: featureOperation.inputPorts.map((inputPort) => {
            return {
              id: inputPort.getId(),
              text: inputPort.getId(),
              showHandle: true,
              showInputField: true,
              value: "0",
            };
          }),
          outputItems: [
            {
              id: "value",
              text: "=",
              value: "0",
            },
            {
              id: "derivative",
              text: `d(y)/d(${text}) =`,
              value: "0",
            },
          ],
          onBodyClick: callOnBodyClick,
        };
      }
    }
  }

  private getNewReactFlowId(): string {
    return `${this.nextReactFlowId++}`;
  }

  private getNewFeatureOperationId(): string {
    return `Custom ${this.nextFeatureOperationId++}`;
  }

  private findFeatureOperation(
    nodeType: string,
    featureOperations: FeatureOperation[],
  ): FeatureOperation {
    const operation = featureOperations.find((op) => op.id === nodeType);
    if (operation === undefined) {
      throw new Error(`Couldn't find the feature operation ${nodeType}`);
    }
    return operation;
  }

  private getNewReactFlowNodePosition(nodes: Node[]): XYPosition {
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

  private selectNode(id: string, nodes: Node[]): Node[] {
    return nodes.map((node) => {
      if (node.id !== id) {
        node.selected = false;
        return node;
      }

      node.selected = true;
      return node;
    });
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

export default GraphController;
