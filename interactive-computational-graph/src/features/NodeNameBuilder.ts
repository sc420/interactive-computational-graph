import type NodeNameBuilderState from "../states/NodeNameBuilderState";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";

class NodeNameBuilder {
  private constantCounter = 1;
  private variableCounter = 1;
  private operationIdToCounter = new Map<string, number>();

  buildName(
    featureNodeType: FeatureNodeType,
    featureOperation: FeatureOperation | null,
  ): string {
    let prefix: string;
    let counter: number;
    if (featureNodeType.nodeType === "constant") {
      prefix = "c";
      counter = this.constantCounter;
      this.constantCounter += 1;
    } else if (featureNodeType.nodeType === "variable") {
      prefix = "v";
      counter = this.variableCounter;
      this.variableCounter += 1;
    } else {
      if (featureOperation === null) {
        throw new Error("Should provide operation for operation type");
      }
      prefix = featureOperation.namePrefix;
      const operationId = featureNodeType.operationId;
      const foundCounter = this.operationIdToCounter.get(operationId);
      counter = foundCounter === undefined ? 1 : foundCounter;
      this.operationIdToCounter.set(operationId, counter + 1);
    }
    return this.buildLatexName(prefix, counter);
  }

  private buildLatexName(prefix: string, counter: number): string {
    if (counter < 10) {
      return `${prefix}_${counter}`;
    }
    return `${prefix}_{${counter}}`;
  }

  save(): NodeNameBuilderState {
    return {
      constantCounter: this.constantCounter,
      variableCounter: this.variableCounter,
      operationIdToCounter: Object.fromEntries(this.operationIdToCounter),
    };
  }

  load(state: NodeNameBuilderState): void {
    this.constantCounter = state.constantCounter;
    this.variableCounter = state.variableCounter;
    this.operationIdToCounter = new Map(
      Object.entries(state.operationIdToCounter),
    );
  }
}

export default NodeNameBuilder;
