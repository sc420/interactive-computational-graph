import type NodeRelationshipState from "./NodeRelationshipState";

interface ConstantNodeState {
  nodeType: "constant";
  value: string;
  relationship: NodeRelationshipState;
}

interface VariableNodeState {
  nodeType: "variable";
  value: string;
  relationship: NodeRelationshipState;
}

interface OperationNodeState {
  nodeType: "operation";
  operationId: string;
  relationship: NodeRelationshipState;
}

type CoreNodeState = ConstantNodeState | VariableNodeState | OperationNodeState;

export default CoreNodeState;
