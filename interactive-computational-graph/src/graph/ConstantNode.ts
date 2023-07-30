import type GraphNode from "./GraphNode";
import NodeRelationship from "./NodeRelationship";

class ConstantNode implements GraphNode {
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

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
  }

  updateF(): void {}

  calculateDfdy(y: GraphNode): number {
    return 0;
  }

  getRelationship(): NodeRelationship {
    return this.nodeRelationship;
  }
}

export default ConstantNode;
