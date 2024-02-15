// import type CoreGraphState from "./CoreGraphState";

interface CoreGraphAdapterState {
  // TODO(sc420): Uncomment
  // coreGraphState: CoreGraphState;
  nodeIdToNames: Record<string, string>;
  dummyInputNodeIdToNodeIds: Record<string, string>;
}

export default CoreGraphAdapterState;
