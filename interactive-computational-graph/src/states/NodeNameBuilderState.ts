interface NodeNameBuilderState {
  constantCounter: number;
  variableCounter: number;
  operationIdToCounter: Map<string, number>;
}

export default NodeNameBuilderState;
