import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";

class NodeNameBuilder {
  private constantCounter = 1;
  private variableCounter = 1;
  private readonly operationIdToCounter = new Map<string, number>();

  buildName(
    featureNodeType: FeatureNodeType,
    featureOperation: FeatureOperation | null,
  ): string {
    let prefix: string;
    let counter: number;
    if (featureNodeType.nodeType === "CONSTANT") {
      prefix = "c";
      counter = this.constantCounter;
      this.constantCounter += 1;
    } else if (featureNodeType.nodeType === "VARIABLE") {
      prefix = "v";
      counter = this.variableCounter;
      this.variableCounter += 1;
    } else {
      if (featureOperation === null) {
        throw new Error("Should provide operation for operation type");
      }
      prefix = featureOperation.id;
      const operationId = featureNodeType.operationId;
      const foundCounter = this.operationIdToCounter.get(operationId);
      counter = foundCounter === undefined ? 1 : foundCounter;
      this.operationIdToCounter.set(operationId, counter + 1);
    }
    return `${prefix}_${counter}`;
  }
}

export default NodeNameBuilder;