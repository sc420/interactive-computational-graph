import {
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
} from "reactflow";
import type ChainRuleTerm from "../core/ChainRuleTerm";
import ConstantNode from "../core/ConstantNode";
import {
  CycleError,
  InputNodeAlreadyConnectedError,
  InputPortFullError,
} from "../core/CoreErrors";
import type CoreNode from "../core/CoreNode";
import type DifferentiationMode from "../core/DifferentiationMode";
import Graph from "../core/Graph";
import OperationNode from "../core/OperationNode";
import VariableNode from "../core/VariableNode";
import { buildExplainDerivativeItems } from "./ExplainDerivativeController";
import type ExplainDerivativeData from "./ExplainDerivativeData";
import type ExplainDerivativeType from "./ExplainDerivativeType";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";
import { findFeatureOperation } from "./OperationUtilities";

type ConnectionAddedCallback = (connection: Connection) => void;

type ConnectionErrorCallback = (error: Error) => void;

type TargetNodeUpdatedCallback = (targetNodeId: string | null) => void;

type ShowInputFieldsCallback = (emptyPortEdges: Edge[]) => void;

type HideInputFieldCallback = (nonEmptyPortConnection: Connection) => void;

type FValuesUpdatedCallback = (nodeIdToFValues: Map<string, string>) => void;

type DerivativeValuesUpdatedCallback = (
  nodeIdToDerivatives: Map<string, string>,
) => void;

type ExplainDerivativeDataUpdatedCallback = (
  data: ExplainDerivativeData[],
) => void;

class CoreGraphAdapter {
  private readonly graph = new Graph();

  private selectedNodeIds: string[] = [];

  private connectionAddedCallbacks: ConnectionAddedCallback[] = [];
  private connectionErrorCallbacks: ConnectionErrorCallback[] = [];
  private targetNodeUpdatedCallbacks: TargetNodeUpdatedCallback[] = [];
  private showInputFieldsCallbacks: ShowInputFieldsCallback[] = [];
  private hideInputFieldCallbacks: HideInputFieldCallback[] = [];
  private fValuesUpdatedCallbacks: FValuesUpdatedCallback[] = [];
  private derivativesUpdatedCallbacks: FValuesUpdatedCallback[] = [];
  private explainDerivativeDataUpdatedCallbacks: ExplainDerivativeDataUpdatedCallback[] =
    [];

  addNode(
    featureNodeType: FeatureNodeType,
    nodeId: string,
    featureOperations: FeatureOperation[],
  ): void {
    const coreNode = this.buildCoreNode(
      featureNodeType,
      nodeId,
      featureOperations,
    );
    this.graph.addNode(coreNode);

    this.addDummyInputNodes(coreNode);

    this.updateOutputs();
  }

  private buildCoreNode(
    featureNodeType: FeatureNodeType,
    nodeId: string,
    featureOperations: FeatureOperation[],
  ): CoreNode {
    switch (featureNodeType.nodeType) {
      case "CONSTANT": {
        return new ConstantNode(nodeId);
      }
      case "VARIABLE": {
        return new VariableNode(nodeId);
      }
      case "OPERATION": {
        const featureOperation = findFeatureOperation(
          featureNodeType.operationId,
          featureOperations,
        );
        return new OperationNode(
          nodeId,
          featureOperation.inputPorts,
          featureOperation.operation,
        );
      }
    }
  }

  private addDummyInputNodes(node: CoreNode): void {
    node.getRelationship().inputPorts.forEach((inputPort) => {
      const portId = inputPort.getId();
      const dummyInputNodeId = this.getDummyInputNodeId(node.getId(), portId);
      const dummyInputNode = new ConstantNode(dummyInputNodeId);
      this.graph.addNode(dummyInputNode);
      this.graph.connect(dummyInputNodeId, node.getId(), portId);
    });
  }

  addConnection(connection: Connection): void {
    if (
      connection.source === null ||
      connection.target === null ||
      connection.targetHandle === null
    ) {
      return;
    }

    let hasDisconnectedDummyInputNode = false;
    if (
      this.isDummyInputNodeConnected(connection.target, connection.targetHandle)
    ) {
      this.disconnectDummyInputNode(connection.target, connection.targetHandle);
      hasDisconnectedDummyInputNode = true;
    }

    try {
      this.graph.validateConnect(
        connection.source,
        connection.target,
        connection.targetHandle,
      );
    } catch (error: any) {
      if (
        error instanceof InputNodeAlreadyConnectedError ||
        error instanceof InputPortFullError ||
        error instanceof CycleError
      ) {
        // Revert dummy input node disconnection
        if (hasDisconnectedDummyInputNode) {
          this.connectDummyInputNode(
            connection.target,
            connection.targetHandle,
          );
        }

        this.emitConnectionError(error as Error);
        return;
      } else {
        throw error;
      }
    }

    this.graph.connect(
      connection.source,
      connection.target,
      connection.targetHandle,
    );

    this.emitConnectionAdded(connection);

    this.emitHideInputField(connection);

    this.updateOutputs();
  }

  getNodeIds(): string[] {
    return this.graph
      .getNodes()
      .map((node) => node.getId())
      .filter((nodeId) => !this.isDummyInputNodeId(nodeId));
  }

  setDifferentiationMode(differentiationMode: DifferentiationMode): void {
    this.graph.setDifferentiationMode(differentiationMode);

    this.updateOutputs();
  }

  setTargetNode(nodeId: string | null): void {
    this.graph.setTargetNode(nodeId);

    this.updateOutputs();
  }

  updateNodeValueById(
    nodeId: string,
    inputPortId: string,
    value: string,
  ): void {
    const nodeType = this.graph.getNodeType(nodeId);
    switch (nodeType) {
      case "CONSTANT": {
        this.graph.setNodeValue(nodeId, value);
        break;
      }
      case "VARIABLE": {
        this.graph.setNodeValue(nodeId, value);
        break;
      }
      case "OPERATION": {
        const dummyInputNodeId = this.getDummyInputNodeId(nodeId, inputPortId);
        this.graph.setNodeValue(dummyInputNodeId, value);
        break;
      }
    }

    this.updateOutputs();
  }

  changeNodes(changes: NodeChange[]): void {
    let hasRemovedNodes = false;
    changes.forEach((change) => {
      switch (change.type) {
        case "remove": {
          const nodeId = change.id;
          const coreNode = this.graph.getOneNode(nodeId);
          this.removeDummyInputNodes(coreNode);

          this.graph.removeNode(nodeId);
          hasRemovedNodes = true;
          break;
        }
      }
    });

    if (hasRemovedNodes) {
      this.updateTargetNode();

      this.updateOutputs();
    }
  }

  private removeDummyInputNodes(node: CoreNode): void {
    node.getRelationship().inputPorts.forEach((inputPort) => {
      const portId = inputPort.getId();
      const dummyNodeId = this.getDummyInputNodeId(node.getId(), portId);
      this.graph.removeNode(dummyNodeId);
    });
  }

  private updateTargetNode(): void {
    const targetNodeId = this.graph.getTargetNode();
    if (targetNodeId === null) {
      return;
    }
    if (this.graph.hasNode(targetNodeId)) {
      return;
    }

    this.graph.setTargetNode(null);

    this.emitTargetNodeChanged(null);
  }

  changeEdges(changes: EdgeChange[], edges: Edge[]): void {
    const removeEdges = this.findEdgesToRemove(changes, edges);

    let hasDisconnectedEdges = false;
    removeEdges.forEach((removeEdge) => {
      if (typeof removeEdge.targetHandle !== "string") {
        return;
      }
      this.graph.disconnect(
        removeEdge.source,
        removeEdge.target,
        removeEdge.targetHandle,
      );
      hasDisconnectedEdges = true;
    });

    const emptyPortEdges = this.findEmptyPortEdges(removeEdges);

    emptyPortEdges.forEach((emptyPortEdge) => {
      if (typeof emptyPortEdge.targetHandle !== "string") {
        return;
      }
      if (
        this.isDummyInputNodeConnected(
          emptyPortEdge.target,
          emptyPortEdge.targetHandle,
        )
      ) {
        return;
      }
      this.connectDummyInputNode(
        emptyPortEdge.target,
        emptyPortEdge.targetHandle,
      );
    });

    if (hasDisconnectedEdges) {
      this.emitShowInputFields(emptyPortEdges);

      this.updateOutputs();
    }
  }

  private findEdgesToRemove(changes: EdgeChange[], edges: Edge[]): Edge[] {
    const removeEdgeIds = new Set<string>();
    changes.forEach((change) => {
      switch (change.type) {
        case "remove": {
          removeEdgeIds.add(change.id);
          break;
        }
      }
    });

    const removeEdges: Edge[] = [];
    edges.forEach((edge) => {
      if (removeEdgeIds.has(edge.id)) {
        removeEdges.push(edge);
      }
    });
    return removeEdges;
  }

  private findEmptyPortEdges(removeEdges: Edge[]): Edge[] {
    return removeEdges.filter((removeEdge) => {
      if (typeof removeEdge.targetHandle !== "string") {
        return false;
      }
      const node = this.graph.getOneNode(removeEdge.target);
      return node.getRelationship().isInputPortEmpty(removeEdge.targetHandle);
    });
  }

  private connectDummyInputNode(nodeId: string, portId: string): void {
    const dummyInputNodeId = this.getDummyInputNodeId(nodeId, portId);
    this.graph.connect(dummyInputNodeId, nodeId, portId);
  }

  private disconnectDummyInputNode(nodeId: string, portId: string): void {
    const dummyInputNodeId = this.getDummyInputNodeId(nodeId, portId);
    this.graph.disconnect(dummyInputNodeId, nodeId, portId);
  }

  private isDummyInputNodeConnected(nodeId: string, portId: string): boolean {
    const node = this.graph.getOneNode(nodeId);
    const dummyInputNodeId = this.getDummyInputNodeId(nodeId, portId);
    return node.getRelationship().hasInputNodeByPort(portId, dummyInputNodeId);
  }

  private getDummyInputNodeId(nodeId: string, portId: string): string {
    return `dummy-input-node-${nodeId}-${portId}`;
  }

  private isDummyInputNodeId(nodeId: string): boolean {
    return nodeId.startsWith("dummy-input-node-");
  }

  updateOutputs(): void {
    this.updateFValues();
    this.updateDerivatives();
    this.updateExplainDerivativeData();
  }

  private updateFValues(): void {
    const updatedNodeIds = this.graph.updateFValues();
    const updatedNodeIdToFValues = new Map<string, string>();
    updatedNodeIds.forEach((updatedNodeId) => {
      const value = this.graph.getNodeValue(updatedNodeId);
      updatedNodeIdToFValues.set(updatedNodeId, `${value}`);
    });

    this.emitFValuesUpdated(updatedNodeIdToFValues);
  }

  private updateDerivatives(): void {
    this.graph.updateDerivatives();
    const updatedNodeIdToDerivatives = new Map<string, string>();
    this.graph.getNodes().forEach((node) => {
      const value = this.graph.getNodeDerivative(node.getId());
      updatedNodeIdToDerivatives.set(node.getId(), `${value}`);
    });

    this.emitDerivativeValuesUpdated(updatedNodeIdToDerivatives);
  }

  updateSelectedNodes(selectedNodeIds: string[]): void {
    this.selectedNodeIds = selectedNodeIds;

    this.updateExplainDerivativeData();
  }

  private updateExplainDerivativeData(): void {
    const targetNodeId = this.graph.getTargetNode();
    let explainDerivativeData: ExplainDerivativeData[];
    if (targetNodeId === null) {
      explainDerivativeData = [];
    } else {
      explainDerivativeData = this.selectedNodeIds.map(
        (nodeId): ExplainDerivativeData => {
          const explainDerivativeType = this.getExplainDerivativeType(nodeId);
          const nodeDerivative = this.graph.getNodeDerivative(nodeId);
          const differentiationMode = this.graph.getDifferentiationMode();
          const chainRuleTerms = this.getChainRuleTerms(nodeId);
          const items = buildExplainDerivativeItems(
            explainDerivativeType,
            nodeId,
            nodeDerivative,
            differentiationMode,
            targetNodeId,
            chainRuleTerms,
          );
          return {
            nodeId,
            items,
          };
        },
      );
    }

    this.emitExplainDerivativeDataUpdated(explainDerivativeData);
  }

  private getChainRuleTerms(nodeId: string): ChainRuleTerm[] {
    if (this.getExplainDerivativeType(nodeId) !== "someValueBecauseChainRule") {
      return [];
    }

    return this.graph.explainChainRule(nodeId);
  }

  private getExplainDerivativeType(nodeId: string): ExplainDerivativeType {
    if (this.graph.getNodeType(nodeId) === "CONSTANT") {
      return "zeroBecauseXIsConstant";
    }

    if (!this.graph.hasNodeDerivative(nodeId)) {
      return "zeroBecauseFNotDependsOnX";
    }

    if (nodeId === this.graph.getTargetNode()) {
      return "oneBecauseFEqualsX";
    }

    return "someValueBecauseChainRule";
  }

  onConnectionAdded(callback: ConnectionAddedCallback): void {
    this.connectionAddedCallbacks.push(callback);
  }

  onConnectionError(callback: ConnectionErrorCallback): void {
    this.connectionErrorCallbacks.push(callback);
  }

  onTargetNodeUpdated(callback: TargetNodeUpdatedCallback): void {
    this.targetNodeUpdatedCallbacks.push(callback);
  }

  onShowInputFields(callback: ShowInputFieldsCallback): void {
    this.showInputFieldsCallbacks.push(callback);
  }

  onHideInputField(callback: HideInputFieldCallback): void {
    this.hideInputFieldCallbacks.push(callback);
  }

  onFValuesUpdated(callback: FValuesUpdatedCallback): void {
    this.fValuesUpdatedCallbacks.push(callback);
  }

  onDerivativeValuesUpdated(callback: DerivativeValuesUpdatedCallback): void {
    this.derivativesUpdatedCallbacks.push(callback);
  }

  onExplainDerivativeDataUpdated(
    callback: ExplainDerivativeDataUpdatedCallback,
  ): void {
    this.explainDerivativeDataUpdatedCallbacks.push(callback);
  }

  removeAllCallbacks(): void {
    this.connectionAddedCallbacks = [];
    this.connectionErrorCallbacks = [];
    this.targetNodeUpdatedCallbacks = [];
    this.showInputFieldsCallbacks = [];
    this.hideInputFieldCallbacks = [];
    this.fValuesUpdatedCallbacks = [];
    this.derivativesUpdatedCallbacks = [];
    this.explainDerivativeDataUpdatedCallbacks = [];
  }

  private emitConnectionAdded(connection: Connection): void {
    this.connectionAddedCallbacks.forEach((callback) => {
      callback(connection);
    });
  }

  private emitConnectionError(error: Error): void {
    this.connectionErrorCallbacks.forEach((callback) => {
      callback(error);
    });
  }

  private emitTargetNodeChanged(targetNodeId: string | null): void {
    this.targetNodeUpdatedCallbacks.forEach((callback) => {
      callback(targetNodeId);
    });
  }

  private emitHideInputField(nonEmptyPortConnection: Connection): void {
    this.hideInputFieldCallbacks.forEach((callback) => {
      callback(nonEmptyPortConnection);
    });
  }

  private emitShowInputFields(emptyPortEdges: Edge[]): void {
    this.showInputFieldsCallbacks.forEach((callback) => {
      callback(emptyPortEdges);
    });
  }

  private emitFValuesUpdated(nodeIdToFValues: Map<string, string>): void {
    this.fValuesUpdatedCallbacks.forEach((callback) => {
      callback(nodeIdToFValues);
    });
  }

  private emitDerivativeValuesUpdated(
    nodeIdToDerivatives: Map<string, string>,
  ): void {
    this.derivativesUpdatedCallbacks.forEach((callback) => {
      callback(nodeIdToDerivatives);
    });
  }

  private emitExplainDerivativeDataUpdated(
    data: ExplainDerivativeData[],
  ): void {
    this.explainDerivativeDataUpdatedCallbacks.forEach((callback) => {
      callback(data);
    });
  }
}

export default CoreGraphAdapter;
