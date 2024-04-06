interface ConstantType {
  nodeType: "constant";
}

interface VariableType {
  nodeType: "variable";
}

interface OperationType {
  nodeType: "operation";
  operationId: string;
}

type FeatureNodeType = ConstantType | VariableType | OperationType;

export default FeatureNodeType;
