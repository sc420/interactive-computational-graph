import type CoreNode from "./CoreNode";
import NodeRelationship from "./NodeRelationship";

class ConstantNode implements CoreNode {
  private readonly id: string;

  private readonly nodeRelationship: NodeRelationship = new NodeRelationship(
    [],
  );

  private value: number = 0;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  isConstant(): boolean {
    return true;
  }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
  }

  updateF(): void {}

  calculateDfdy(y: CoreNode): number {
    return 0;
  }

  getRelationship(): NodeRelationship {
    return this.nodeRelationship;
  }
}

export default ConstantNode;
