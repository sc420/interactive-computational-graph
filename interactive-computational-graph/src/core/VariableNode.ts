import type CoreNode from "./CoreNode";
import NodeRelationship from "./NodeRelationship";
import type NodeType from "./NodeType";

class VariableNode implements CoreNode {
  private readonly id: string;

  private readonly nodeRelationship: NodeRelationship = new NodeRelationship(
    [],
  );

  private value: number = 0;

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

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
  }

  updateF(): void {}

  calculateDfdy(y: CoreNode): number {
    if (y.isConstant()) {
      return 0;
    }
    if (y.getId() === this.getId()) {
      return 1;
    }
    return 0;
  }

  getRelationship(): NodeRelationship {
    return this.nodeRelationship;
  }
}

export default VariableNode;
