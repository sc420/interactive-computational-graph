import type CoreGraphState from "./CoreGraphState";

interface CoreGraphAdapterState {
  coreGraphState: CoreGraphState;
  nodeIdToNames: Record<string, string>;
  dummyInputNodeIdToNodeIds: Record<string, string>;
}

export default CoreGraphAdapterState;
