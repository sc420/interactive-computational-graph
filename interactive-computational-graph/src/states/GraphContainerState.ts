import { type ReactFlowJsonObject } from "reactflow";
import type CoreGraphAdapterState from "./CoreGraphAdapterState";
import type FeatureOperationState from "./FeatureOperationState";
import type NodeNameBuilderState from "./NodeNameBuilderState";

interface GraphContainerState {
  // Core graph
  coreGraphAdapterState: CoreGraphAdapterState;

  // Graph state
  isReverseMode: boolean;
  derivativeTarget: string | null;
  featureOperations: FeatureOperationState[];
  nextNodeId: number;
  nodeNameBuilderState: NodeNameBuilderState;
  nextOperationId: number;

  // Feature panel states
  operationIdsAddedAtLeastOnce: string[];

  // React Flow states
  reactFlowState: ReactFlowJsonObject;
}

export default GraphContainerState;
