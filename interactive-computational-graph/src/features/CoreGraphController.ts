import ConstantNode from "../core/ConstantNode";
import type CoreNode from "../core/CoreNode";
import type Graph from "../core/Graph";
import OperationNode from "../core/OperationNode";
import VariableNode from "../core/VariableNode";
import { findFeatureOperation } from "./ControllerUtilities";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";

const addCoreNode = (
  graph: Graph,
  featureNodeType: FeatureNodeType,
  id: string,
  featureOperations: FeatureOperation[],
): void => {
  const coreNode = buildCoreNode(featureNodeType, id, featureOperations);
  graph.addNode(coreNode);
};

const removeCoreNode = (id: string, graph: Graph): Graph => {
  graph.removeNode(id);
  return graph;
};

const connectCoreEdge = (
  graph: Graph,
  node1Id: string,
  node2Id: string,
  node2PortId: string,
): void => {
  graph.connect(node1Id, node2Id, node2PortId);
};

const disconnectCoreEdge = (
  graph: Graph,
  node1Id: string,
  node2Id: string,
  node2PortId: string,
): void => {
  graph.disconnect(node1Id, node2Id, node2PortId);
};

const updateOneNodeValue = (
  graph: Graph,
  nodeId: string,
  value: string,
): void => {
  const nodeType = graph.getNodeType(nodeId);
  switch (nodeType) {
    case "CONSTANT": {
      graph.setNodeValue(nodeId, Number(value));
      break;
    }
    case "VARIABLE": {
      graph.setNodeValue(nodeId, Number(value));
      break;
    }
    case "OPERATION": {
      // TODO(sc420): Update the dummy constant nodes of the operation node
    }
  }
};

const updateNodeValues = (graph: Graph): string[] => {
  const updatedFValuesNodeIds = graph.updateFValues();
  const updatedDerivativesNodeIds = graph.updateDerivatives();
  const updatedNodeIds = new Set([
    ...updatedFValuesNodeIds,
    ...updatedDerivativesNodeIds,
  ]);
  return Array.from(updatedNodeIds);
};

const buildCoreNode = (
  featureNodeType: FeatureNodeType,
  id: string,
  featureOperations: FeatureOperation[],
): CoreNode => {
  switch (featureNodeType.nodeType) {
    case "CONSTANT": {
      return new ConstantNode(id);
    }
    case "VARIABLE": {
      return new VariableNode(id);
    }
    case "OPERATION": {
      const featureOperation = findFeatureOperation(
        featureNodeType.operationId,
        featureOperations,
      );
      return new OperationNode(
        id,
        featureOperation.inputPorts,
        featureOperation.operation,
      );
    }
  }
};

export {
  addCoreNode,
  connectCoreEdge,
  disconnectCoreEdge,
  removeCoreNode,
  updateNodeValues,
  updateOneNodeValue,
};
