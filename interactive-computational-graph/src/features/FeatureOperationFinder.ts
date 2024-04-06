import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";

const findFeatureOperation = (
  featureNodeType: FeatureNodeType,
  featureOperations: FeatureOperation[],
): FeatureOperation | null => {
  if (featureNodeType.nodeType !== "operation") {
    return null;
  }

  const operationId = featureNodeType.operationId;
  const operation = featureOperations.find((op) => op.id === operationId);
  if (operation === undefined) {
    throw new Error(`Couldn't find the feature operation ${operationId}`);
  }
  return operation;
};

export { findFeatureOperation };
