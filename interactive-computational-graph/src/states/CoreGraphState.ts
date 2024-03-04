import type DifferentiationMode from "../core/DifferentiationMode";
import type CoreNodeState from "./CoreNodeState";

interface CoreGraphState {
  nodeIdToNodes: Record<string, CoreNodeState>;
  differentiationMode: DifferentiationMode;
  targetNodeId: string | null;
}

export default CoreGraphState;
