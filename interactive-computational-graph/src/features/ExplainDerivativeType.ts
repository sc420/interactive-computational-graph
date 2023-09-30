type ExplainDerivativeType =
  | "someValueBecauseChainRule"
  | "oneBecauseFEqualsX"
  | "zeroBecauseFNotDependsOnX"
  | "zeroBecauseXIsConstant";

export default ExplainDerivativeType;
