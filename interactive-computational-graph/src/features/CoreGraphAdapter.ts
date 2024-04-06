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
import type CoreGraphAdapterState from "../states/CoreGraphAdapterState";
import type CoreGraphState from "../states/CoreGraphState";
import type CoreNodeState from "../states/CoreNodeState";
import type ExplainDerivativeBuildOptions from "./ExplainDerivativeBuildOptions";
import { buildExplainDerivativeItems } from "./ExplainDerivativeController";
import type ExplainDerivativeData from "./ExplainDerivativeData";
import type ExplainDerivativeType from "./ExplainDerivativeType";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";
import { findFeatureOperation } from "./FeatureOperationFinder";

type ConnectionAddedCallback = (connection: Connection) => void;

type ConnectionErrorCallback = (error: Error) => void;

type TargetNodeUpdatedCallback = (targetNodeId: string | null) => void;

type NodeNameUpdatedCallback = (nodeId: string, name: string) => void;

type ShowInputFieldsCallback = (emptyPortEdges: Edge[]) => void;

type HideInputFieldCallback = (nonEmptyPortConnection: Connection) => void;

type FValuesUpdatedCallback = (nodeIdToFValues: Map<string, string>) => void;

type DerivativeValuesUpdatedCallback = (
  differentiationMode: DifferentiationMode,
  targetNodeName: string | null,
  nodeIdToDerivatives: ReadonlyMap<string, string>,
  nodeIdToNames: ReadonlyMap<string, string>,
) => void;

type ExplainDerivativeDataUpdatedCallback = (
  data: ExplainDerivativeData[],
) => void;

class CoreGraphAdapter {
  private readonly graph = new Graph();

  private nodeIdToNames = new Map<string, string>();
  private dummyInputNodeIdToNodeIds = new Map<string, string>();
  private selectedNodeIds: string[] = [];

  private connectionAddedCallbacks: ConnectionAddedCallback[] = [];
  private connectionErrorCallbacks: ConnectionErrorCallback[] = [];
  private targetNodeUpdatedCallbacks: TargetNodeUpdatedCallback[] = [];
  private nodeNameUpdatedCallbacks: NodeNameUpdatedCallback[] = [];
  private showInputFieldsCallbacks: ShowInputFieldsCallback[] = [];
  private hideInputFieldCallbacks: HideInputFieldCallback[] = [];
  private fValuesUpdatedCallbacks: FValuesUpdatedCallback[] = [];
  private derivativesUpdatedCallbacks: DerivativeValuesUpdatedCallback[] = [];
  private explainDerivativeDataUpdatedCallbacks: ExplainDerivativeDataUpdatedCallback[] =
    [];

  addNode(
    featureNodeType: FeatureNodeType,
    featureOperation: FeatureOperation | null,
    nodeId: string,
    nodeName: string,
  ): void {
    const coreNode = this.buildCoreNode(
      featureNodeType,
      featureOperation,
      nodeId,
    );
    this.graph.addNode(coreNode);
    this.nodeIdToNames.set(nodeId, nodeName);

    this.addDummyInputNodes(coreNode, nodeName);

    this.updateOutputs();
  }

  private buildCoreNode(
    featureNodeType: FeatureNodeType,
    featureOperation: FeatureOperation | null,
    nodeId: string,
  ): CoreNode {
    switch (featureNodeType.nodeType) {
      case "CONSTANT": {
        return new ConstantNode(nodeId);
      }
      case "VARIABLE": {
        return new VariableNode(nodeId);
      }
      case "OPERATION": {
        if (featureOperation === null) {
          throw new Error("Should provide the operation");
        }
        return new OperationNode(
          nodeId,
          featureOperation.inputPorts,
          featureOperation.id,
          featureOperation.operation,
        );
      }
    }
  }

  private addDummyInputNodes(node: CoreNode, nodeName: string): void {
    node.getRelationship().inputPorts.forEach((inputPort) => {
      const portId = inputPort.getId();
      const dummyInputNodeId = this.getDummyInputNodeId(node.getId(), portId);
      const dummyInputNodeName = this.getDummyInputNodeName(nodeName, portId);
      const dummyInputNode = new ConstantNode(dummyInputNodeId);
      this.graph.addNode(dummyInputNode);
      this.nodeIdToNames.set(dummyInputNodeId, dummyInputNodeName);
      this.dummyInputNodeIdToNodeIds.set(dummyInputNodeId, node.getId());

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

        const errorMessage = this.buildConnectionErrorMessage(error);
        this.emitConnectionError(new Error(errorMessage));
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

  private buildConnectionErrorMessage(error: any): string {
    if (error instanceof InputNodeAlreadyConnectedError) {
      if (error.node2Id === undefined) {
        throw new Error("Error should contain node2Id");
      }
      const node1Name = this.getNodeNameById(error.node1Id);
      const node2Name = this.getNodeNameById(error.node2Id);
      return `Input node ${node1Name} is already connected to node \
${node2Name} by port ${error.node2PortId}`;
    } else if (error instanceof InputPortFullError) {
      if (error.nodeId === undefined) {
        throw new Error("Error should contain node2Id");
      }
      const nodeName = this.getNodeNameById(error.nodeId);
      return `Input port ${error.portId} of node ${nodeName} doesn't allow \
multiple edges`;
    } else if (error instanceof CycleError) {
      const node1Name = this.getNodeNameById(error.node1Id);
      const node2Name = this.getNodeNameById(error.node2Id);
      return `Connecting node ${node1Name} to node ${node2Name} would cause a \
cycle`;
    }

    return error.message;
  }

  setDifferentiationMode(differentiationMode: DifferentiationMode): void {
    this.graph.setDifferentiationMode(differentiationMode);

    this.updateOutputs();
  }

  setTargetNode(nodeId: string | null): void {
    this.graph.setTargetNode(nodeId);

    this.updateOutputs();
  }

  updateNodeNameById(nodeId: string, name: string): void {
    this.nodeIdToNames.set(nodeId, name);
    const node = this.graph.getNodeById(nodeId);
    const nodeName = this.getNodeNameById(nodeId);
    this.renameDummyInputNodes(node, nodeName);

    this.emitNodeNameUpdated(nodeId, name);

    this.updateDerivatives();
    this.updateExplainDerivativeData();
  }

  private renameDummyInputNodes(node: CoreNode, nodeName: string): void {
    node.getRelationship().inputPorts.forEach((inputPort) => {
      const portId = inputPort.getId();
      const dummyNodeId = this.getDummyInputNodeId(node.getId(), portId);
      const dummyNodeName = this.getDummyInputNodeName(nodeName, portId);
      this.nodeIdToNames.set(dummyNodeId, dummyNodeName);
    });
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
          const coreNode = this.graph.getNodeById(nodeId);
          this.removeDummyInputNodes(coreNode);

          this.graph.removeNode(nodeId);
          this.removeNodeName(nodeId);
          hasRemovedNodes = true;
          break;
        }
      }
    });

    if (hasRemovedNodes) {
      this.updateTargetNode();
      this.selectedNodeIds = this.getExistingSelectedNodeIdsByGraph();

      this.updateOutputs();
    }
  }

  private removeDummyInputNodes(node: CoreNode): void {
    node.getRelationship().inputPorts.forEach((inputPort) => {
      const portId = inputPort.getId();
      const dummyInputNodeId = this.getDummyInputNodeId(node.getId(), portId);
      this.graph.removeNode(dummyInputNodeId);
      this.removeDummyInputNodeToNodeId(dummyInputNodeId);
      this.removeNodeName(dummyInputNodeId);
    });
  }

  private removeDummyInputNodeToNodeId(dummyInputNodeId: string): void {
    if (!this.dummyInputNodeIdToNodeIds.delete(dummyInputNodeId)) {
      throw new Error(
        `dummyInputNodeIdToNodeIds has no dummyInputNodeId ${dummyInputNodeId}`,
      );
    }
  }

  private removeNodeName(nodeId: string): void {
    if (!this.nodeIdToNames.delete(nodeId)) {
      throw new Error(`nodeIdToNames has no nodeId ${nodeId}`);
    }
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

    this.emitTargetNodeUpdated();
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
      const node = this.graph.getNodeById(removeEdge.target);
      return node.getRelationship().isInputPortEmpty(removeEdge.targetHandle);
    });
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
    const updatedNodeIdToNames = new Map<string, string>();
    this.graph.getNodes().forEach((node) => {
      const value = this.graph.getNodeDerivative(node.getId());
      updatedNodeIdToDerivatives.set(node.getId(), `${value}`);
      const nodeName = this.getNodeNameById(node.getId());
      updatedNodeIdToNames.set(node.getId(), nodeName);
    });

    this.emitDerivativeValuesUpdated(
      updatedNodeIdToDerivatives,
      updatedNodeIdToNames,
    );
  }

  updateSelectedNodeIds(selectedNodeIds: string[]): void {
    this.selectedNodeIds = selectedNodeIds;

    this.updateExplainDerivativeData();
  }

  private updateExplainDerivativeData(): void {
    const targetNodeId = this.graph.getTargetNode();
    let explainDerivativeData: ExplainDerivativeData[];
    if (targetNodeId === null) {
      explainDerivativeData = [];
    } else {
      const existingSelectedNodeIds = this.getExistingSelectedNodeIdsByGraph();
      explainDerivativeData = existingSelectedNodeIds.map(
        (nodeId): ExplainDerivativeData => {
          const nodeName = this.getNodeNameById(nodeId);
          const explainDerivativeType = this.getExplainDerivativeType(nodeId);
          const options: ExplainDerivativeBuildOptions = {
            differentiationMode: this.graph.getDifferentiationMode(),
            targetNodeId,
            nodeId,
            nodeDerivative: this.graph.getNodeDerivative(nodeId),
            chainRuleTerms: this.getChainRuleTerms(nodeId),
            nodeIdToNames: this.nodeIdToNames,
          };
          const items = buildExplainDerivativeItems(
            explainDerivativeType,
            options,
          );
          return {
            nodeId,
            nodeName,
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

  private getExistingSelectedNodeIdsByGraph(): string[] {
    return this.selectedNodeIds.filter((selectedNodeId) =>
      this.graph.hasNode(selectedNodeId),
    );
  }

  getVisibleNodeNames(): string[] {
    return this.getVisibleNodeIds().map((nodeId) =>
      this.getNodeNameById(nodeId),
    );
  }

  getVisibleNodeIdById(nodeId: string): string {
    if (!this.isDummyInputNodeId(nodeId)) {
      return nodeId;
    }

    const visibleNodeId = this.dummyInputNodeIdToNodeIds.get(nodeId);
    if (visibleNodeId === undefined) {
      throw new Error(
        `Should get the visible node ID from the dummy input node Id ${nodeId}`,
      );
    }
    return visibleNodeId;
  }

  getVisibleNodeIds(): string[] {
    return this.graph
      .getNodes()
      .map((node) => node.getId())
      .filter((nodeId) => !this.isDummyInputNodeId(nodeId));
  }

  getNodeNameById(nodeId: string): string {
    const nodeName = this.nodeIdToNames.get(nodeId);
    if (nodeName === undefined) {
      throw new Error(`Should find the node name of node ID ${nodeId}`);
    }
    return nodeName;
  }

  getNodeValueById(nodeId: string): string {
    return this.graph.getNodeValue(nodeId);
  }

  save(): CoreGraphAdapterState {
    return {
      coreGraphState: this.graph.save(),
      nodeIdToNames: Object.fromEntries(this.nodeIdToNames),
      dummyInputNodeIdToNodeIds: Object.fromEntries(
        this.dummyInputNodeIdToNodeIds,
      ),
    };
  }

  load(
    state: CoreGraphAdapterState,
    featureOperations: FeatureOperation[],
  ): void {
    this.loadGraphState(state.coreGraphState, featureOperations);
    this.nodeIdToNames = new Map(Object.entries(state.nodeIdToNames));
    this.dummyInputNodeIdToNodeIds = new Map(
      Object.entries(state.dummyInputNodeIdToNodeIds),
    );
    this.selectedNodeIds = [];
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
    const node = this.graph.getNodeById(nodeId);
    const dummyInputNodeId = this.getDummyInputNodeId(nodeId, portId);
    return node.getRelationship().hasInputNodeByPort(portId, dummyInputNodeId);
  }

  private getDummyInputNodeId(nodeId: string, portId: string): string {
    return `dummy-input-node-${nodeId}-${portId}`;
  }

  private getDummyInputNodeName(nodeName: string, portId: string): string {
    return `${nodeName}.${portId}`;
  }

  private isDummyInputNodeId(nodeId: string): boolean {
    return nodeId.startsWith("dummy-input-node-");
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

  onNodeNameUpdated(callback: NodeNameUpdatedCallback): void {
    this.nodeNameUpdatedCallbacks.push(callback);
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
    this.nodeNameUpdatedCallbacks = [];
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

  private emitTargetNodeUpdated(): void {
    this.targetNodeUpdatedCallbacks.forEach((callback) => {
      callback(this.graph.getTargetNode());
    });
  }

  private emitNodeNameUpdated(nodeId: string, name: string): void {
    this.nodeNameUpdatedCallbacks.forEach((callback) => {
      callback(nodeId, name);
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
    nodeIdToNames: Map<string, string>,
  ): void {
    const targetNode = this.graph.getTargetNode();
    this.derivativesUpdatedCallbacks.forEach((callback) => {
      callback(
        this.graph.getDifferentiationMode(),
        targetNode === null ? null : this.getNodeNameById(targetNode),
        nodeIdToDerivatives,
        nodeIdToNames,
      );
    });
  }

  private emitExplainDerivativeDataUpdated(
    data: ExplainDerivativeData[],
  ): void {
    this.explainDerivativeDataUpdatedCallbacks.forEach((callback) => {
      callback(data);
    });
  }

  private loadGraphState(
    state: CoreGraphState,
    featureOperations: FeatureOperation[],
  ): void {
    this.graph.clear();
    this.loadGraphNodes(state.nodeIdToNodes, featureOperations);
    this.loadGraphConnections(state.nodeIdToNodes);
    this.graph.setDifferentiationMode(state.differentiationMode);
    this.graph.setTargetNode(state.targetNodeId);

    this.graph.updateFValues();
    this.graph.updateDerivatives();
  }

  private loadGraphNodes(
    nodeIdToNodes: Record<string, CoreNodeState>,
    featureOperations: FeatureOperation[],
  ): void {
    Object.entries(nodeIdToNodes).forEach(([nodeId, coreNodeState]) => {
      const featureNodeType =
        this.getFeatureNodeTypeFromCoreNodeState(coreNodeState);
      const featureOperation = findFeatureOperation(
        featureNodeType,
        featureOperations,
      );

      const node = this.buildCoreNode(
        featureNodeType,
        featureOperation,
        nodeId,
      );
      if (
        coreNodeState.nodeType === "CONSTANT" ||
        coreNodeState.nodeType === "VARIABLE"
      ) {
        node.setValue(coreNodeState.value);
      }

      this.graph.addNode(node);
    });
  }

  private loadGraphConnections(
    nodeIdToNodes: Record<string, CoreNodeState>,
  ): void {
    Object.entries(nodeIdToNodes).forEach(([nodeId, coreNodeState]) => {
      Object.entries(coreNodeState.relationship.inputPortIdToNodeIds).forEach(
        ([inputPortId, inputNodeIds]) => {
          inputNodeIds.forEach((inputNodeId) => {
            this.graph.connect(inputNodeId, nodeId, inputPortId);
          });
        },
      );
    });
  }

  private getFeatureNodeTypeFromCoreNodeState(
    state: CoreNodeState,
  ): FeatureNodeType {
    switch (state.nodeType) {
      case "CONSTANT": {
        return {
          nodeType: "CONSTANT",
        };
      }
      case "VARIABLE": {
        return {
          nodeType: "VARIABLE",
        };
      }
      case "OPERATION": {
        return {
          nodeType: "OPERATION",
          operationId: state.operationId,
        };
      }
    }
  }
}

export default CoreGraphAdapter;
