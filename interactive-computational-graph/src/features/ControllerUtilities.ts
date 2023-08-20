import type FeatureOperation from "./FeatureOperation";

const findFeatureOperation = (
  operationId: string,
  featureOperations: FeatureOperation[],
): FeatureOperation => {
  const operation = featureOperations.find((op) => op.id === operationId);
  if (operation === undefined) {
    throw new Error(`Couldn't find the feature operation ${operationId}`);
  }
  return operation;
};

export { findFeatureOperation };
