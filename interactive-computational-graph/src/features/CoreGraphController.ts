import ConstantNode from "../core/ConstantNode";
import type CoreNode from "../core/CoreNode";
import type Graph from "../core/Graph";
import OperationNode from "../core/OperationNode";
import VariableNode from "../core/VariableNode";
import { findFeatureOperation } from "./ControllerUtilities";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";

const setDerivativeTargetNode = (
  graph: Graph,
  targetNodeId: string | null,
): void => {
  graph.setTargetNode(targetNodeId);
};

const addCoreNodes = (
  graph: Graph,
  featureNodeType: FeatureNodeType,
  nodeId: string,
  featureOperations: FeatureOperation[],
): void => {
  const coreNode = buildCoreNode(featureNodeType, nodeId, featureOperations);
  graph.addNode(coreNode);

  addDummyInputNodes(graph, coreNode);
};

const removeCoreNodes = (graph: Graph, nodeId: string): void => {
  const coreNode = graph.getOneNode(nodeId);
  removeDummyInputNodes(graph, coreNode);

  graph.removeNode(nodeId);
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

const connectDummyInputNode = (
  graph: Graph,
  nodeId: string,
  portId: string,
): void => {
  const dummyInputNodeId = getDummyInputNodeId(nodeId, portId);
  graph.connect(dummyInputNodeId, nodeId, portId);
};

const disconnectDummyInputNode = (
  graph: Graph,
  nodeId: string,
  portId: string,
): void => {
  const dummyInputNodeId = getDummyInputNodeId(nodeId, portId);
  graph.disconnect(dummyInputNodeId, nodeId, portId);
};

const isDummyInputNodeConnected = (
  graph: Graph,
  nodeId: string,
  portId: string,
): boolean => {
  const node = graph.getOneNode(nodeId);
  const dummyInputNodeId = getDummyInputNodeId(nodeId, portId);
  return node.getRelationship().hasInputNodeByPort(portId, dummyInputNodeId);
};

const isNodeInputPortEmpty = (
  graph: Graph,
  nodeId: string,
  portId: string,
): boolean => {
  const node = graph.getOneNode(nodeId);
  return node.getRelationship().isInputPortEmpty(portId);
};

const updateNodeValueById = (
  graph: Graph,
  nodeId: string,
  inputPortId: string,
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
      const dummyInputNodeId = getDummyInputNodeId(nodeId, inputPortId);
      graph.setNodeValue(dummyInputNodeId, Number(value));
      break;
    }
  }
};

const updateNodeFValues = (graph: Graph): Map<string, string> => {
  const updatedNodeIds = graph.updateFValues();
  const updatedNodeIdToValues = new Map<string, string>();
  updatedNodeIds.forEach((updatedNodeId) => {
    const value = graph.getNodeValue(updatedNodeId);
    updatedNodeIdToValues.set(updatedNodeId, `${value}`);
  });
  return updatedNodeIdToValues;
};

const updateNodeDerivativeValues = (graph: Graph): Map<string, string> => {
  graph.updateDerivatives();
  const updatedNodeIdToDerivatives = new Map<string, string>();
  graph.getNodes().forEach((node) => {
    const value = graph.getNodeDerivative(node.getId());
    updatedNodeIdToDerivatives.set(node.getId(), `${value}`);
  });
  return updatedNodeIdToDerivatives;
};

const getNodeIds = (graph: Graph): string[] => {
  return graph
    .getNodes()
    .map((node) => node.getId())
    .filter((nodeId) => !isDummyInputNodeId(nodeId));
};

const buildCoreNode = (
  featureNodeType: FeatureNodeType,
  nodeId: string,
  featureOperations: FeatureOperation[],
): CoreNode => {
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
};

const addDummyInputNodes = (graph: Graph, node: CoreNode): void => {
  node.getRelationship().inputPorts.forEach((inputPort) => {
    const portId = inputPort.getId();
    const dummyInputNodeId = getDummyInputNodeId(node.getId(), portId);
    const dummyInputNode = new ConstantNode(dummyInputNodeId);
    graph.addNode(dummyInputNode);
    graph.connect(dummyInputNodeId, node.getId(), portId);
  });
};

const removeDummyInputNodes = (graph: Graph, node: CoreNode): void => {
  node.getRelationship().inputPorts.forEach((inputPort) => {
    const portId = inputPort.getId();
    const dummyNodeId = getDummyInputNodeId(node.getId(), portId);
    graph.removeNode(dummyNodeId);
  });
};

const getDummyInputNodeId = (nodeId: string, portId: string): string => {
  return `dummy-input-node-${nodeId}-${portId}`;
};

const isDummyInputNodeId = (nodeId: string): boolean => {
  return nodeId.startsWith("dummy-input-node-");
};

export {
  addCoreNodes,
  connectCoreEdge,
  connectDummyInputNode,
  disconnectCoreEdge,
  disconnectDummyInputNode,
  getNodeIds,
  isDummyInputNodeConnected,
  isNodeInputPortEmpty,
  removeCoreNodes,
  setDerivativeTargetNode,
  updateNodeDerivativeValues,
  updateNodeFValues,
  updateNodeValueById,
};
