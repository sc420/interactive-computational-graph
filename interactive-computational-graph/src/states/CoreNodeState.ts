import type NodeRelationshipState from "./NodeRelationshipState";

interface ConstantNodeState {
  nodeType: "CONSTANT";
  value: string;
  relationship: NodeRelationshipState;
}

interface VariableNodeState {
  nodeType: "VARIABLE";
  value: string;
  relationship: NodeRelationshipState;
}

interface OperationNodeState {
  nodeType: "OPERATION";
  operationId: string;
  relationship: NodeRelationshipState;
}

type CoreNodeState = ConstantNodeState | VariableNodeState | OperationNodeState;

export default CoreNodeState;
