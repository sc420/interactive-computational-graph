import type CoreNodeState from "../states/CoreNodeState";
import type CoreNode from "./CoreNode";
import NodeRelationship from "./NodeRelationship";
import type NodeType from "./NodeType";

class VariableNode implements CoreNode {
  private readonly id: string;

  private readonly nodeRelationship: NodeRelationship = new NodeRelationship(
    [],
  );

  private value: string = "0";

  constructor(id: string) {
    this.id = id;
  }

  getType(): NodeType {
    return "VARIABLE";
  }

  getId(): string {
    return this.id;
  }

  isConstant(): boolean {
    return false;
  }

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    this.value = value;
  }

  updateF(): void {}

  calculateDfdx(x: CoreNode): string {
    if (x.isConstant()) {
      return "0";
    }
    if (x.getId() === this.getId()) {
      return "1";
    }
    return "0";
  }

  getRelationship(): NodeRelationship {
    return this.nodeRelationship;
  }

  save(): CoreNodeState {
    return {
      nodeType: "VARIABLE",
      value: this.value,
      relationship: this.nodeRelationship.save(),
    };
  }
}

export default VariableNode;
