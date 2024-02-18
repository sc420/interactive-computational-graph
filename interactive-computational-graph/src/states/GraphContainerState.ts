import type CoreGraphAdapterState from "./CoreGraphAdapterState";
import type FeatureOperationState from "./FeatureOperationState";
// import type NodeNameBuilderState from "./NodeNameBuilderState";

interface GraphContainerState {
  // TODO(sc420): Uncomment other states
  // Core graph
  coreGraphAdapterState: CoreGraphAdapterState;

  // Graph state
  isReverseMode: boolean;
  derivativeTarget: string | null;
  featureOperations: FeatureOperationState[];
  // nextNodeId: number;
  // nodeNameBuilderState: NodeNameBuilderState;
  // nextOperationId: number;

  // Feature panel states
  // operationIdsAddedAtLeastOnce: Set<string>;

  // React Flow states
  // reactFlowState: object;
}

export default GraphContainerState;
