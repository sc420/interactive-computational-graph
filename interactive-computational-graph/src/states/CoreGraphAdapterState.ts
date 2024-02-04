import type CoreGraphState from "./CoreGraphState";

interface CoreGraphAdapterState {
  coreGraphState: CoreGraphState;
  nodeIdToNames: Map<string, string>;
  dummyInputNodeIdToNodeIds: Map<string, string>;
}

export default CoreGraphAdapterState;
