import type GraphNode from "./GraphNode";
import NodeRelationship from "./NodeRelationship";

class VariableNode implements GraphNode {
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
    return false;
  }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
  }

  updateF(): void {}

  calculateDfdy(y: GraphNode): number {
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
