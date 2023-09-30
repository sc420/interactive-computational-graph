import type ExplainDerivativeType from "./ExplainDerivativeType";

type ExplainDerivativeItemType =
  | "calculatePartialDerivative"
  | "useChainRule"
  | "previousDerivativesReplaced"
  | "allReplaced"
  | "equalTo"
  | ExplainDerivativeType;

export default ExplainDerivativeItemType;
