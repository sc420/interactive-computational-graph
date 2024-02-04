import type DifferentiationMode from "../core/DifferentiationMode";

interface CoreGraphState {
  // TODO(sc420): Add nodeIdToNodes state
  differentiationMode: DifferentiationMode;
  targetNodeId: string | null;
  nodeIdToDerivatives: Map<string, string>;
}

export default CoreGraphState;
