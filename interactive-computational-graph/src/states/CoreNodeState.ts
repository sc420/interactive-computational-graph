// TODO(sc420): Add nodeRelationship states

interface ConstantNodeState {
  nodeType: "CONSTANT";
}

interface VariableNodeState {
  nodeType: "VARIABLE";
  value: string;
}

interface OperationNodeState {
  nodeType: "OPERATION";
  value: string;
  operationId: string;
}

type CoreNodeState = ConstantNodeState | VariableNodeState | OperationNodeState;

export default CoreNodeState;
