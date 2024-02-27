interface NodeNameBuilderState {
  constantCounter: number;
  variableCounter: number;
  operationIdToCounter: Record<string, number>;
}

export default NodeNameBuilderState;
