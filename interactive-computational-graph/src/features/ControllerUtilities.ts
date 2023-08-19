import type FeatureOperation from "./FeatureOperation";

const findFeatureOperation = (
  nodeType: string,
  featureOperations: FeatureOperation[],
): FeatureOperation => {
  const operation = featureOperations.find((op) => op.id === nodeType);
  if (operation === undefined) {
    throw new Error(`Couldn't find the feature operation ${nodeType}`);
  }
  return operation;
};

export { findFeatureOperation };
