interface ConstantType {
  nodeType: "CONSTANT";
}

interface VariableType {
  nodeType: "VARIABLE";
}

interface OperationType {
  nodeType: "OPERATION";
  operationId: string;
}

type FeatureNodeType = ConstantType | VariableType | OperationType;

export default FeatureNodeType;
