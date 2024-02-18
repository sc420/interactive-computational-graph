import type CoreNodeState from "../states/CoreNodeState";
import type CoreNode from "./CoreNode";
import NodeRelationship from "./NodeRelationship";
import type NodeType from "./NodeType";

class ConstantNode implements CoreNode {
  private readonly id: string;

  private readonly nodeRelationship: NodeRelationship = new NodeRelationship(
    [],
  );

  private value: string = "0";

  constructor(id: string) {
    this.id = id;
  }

  getType(): NodeType {
    return "CONSTANT";
  }

  getId(): string {
    return this.id;
  }

  isConstant(): boolean {
    return true;
  }

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    this.value = value;
  }

  updateF(): void {}

  calculateDfdx(x: CoreNode): string {
    return "0";
  }

  getRelationship(): NodeRelationship {
    return this.nodeRelationship;
  }

  save(): CoreNodeState {
    return {
      nodeType: "CONSTANT",
    };
  }
}

export default ConstantNode;
