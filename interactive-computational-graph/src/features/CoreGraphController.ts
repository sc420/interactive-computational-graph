import ConstantNode from "../core/ConstantNode";
import type CoreNode from "../core/CoreNode";
import type Graph from "../core/Graph";
import OperationNode from "../core/OperationNode";
import VariableNode from "../core/VariableNode";
import { findFeatureOperation } from "./ControllerUtilities";
import type FeatureOperation from "./FeatureOperation";
import { constantType, variableType } from "./KnownNodeTypes";

const addCoreNode = (
  graph: Graph,
  nodeType: string,
  id: string,
  featureOperations: FeatureOperation[],
): void => {
  const coreNode = buildCoreNode(nodeType, id, featureOperations);
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

const buildCoreNode = (
  nodeType: string,
  id: string,
  featureOperations: FeatureOperation[],
): CoreNode => {
  switch (nodeType) {
    case constantType: {
      return new ConstantNode(id);
    }
    case variableType: {
      return new VariableNode(id);
    }
    default: {
      // Operation
      const featureOperation = findFeatureOperation(
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
};

export { addCoreNode, removeCoreNode, connectCoreEdge, disconnectCoreEdge };
