import type ChainRuleTerm from "../core/ChainRuleTerm";
import type DifferentiationMode from "../core/DifferentiationMode";

interface ExplainDerivativeBuildOptions {
  differentiationMode: DifferentiationMode;
  targetNodeId: string;
  nodeId: string;
  nodeDerivative: string;
  chainRuleTerms: ChainRuleTerm[];
  nodeIdToNames: Map<string, string>;
}

export default ExplainDerivativeBuildOptions;
