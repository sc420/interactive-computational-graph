import type GraphNode from "./GraphNode";
import NodeRelationship from "./NodeRelationship";

class ConstantNode implements GraphNode {
  private readonly id: string;

  private readonly nodeRelationship: NodeRelationship = new NodeRelationship(
    [],
  );

  private value: number = 0;

  private readonly dfdy: number = 0;

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

  getDfdy(): number {
    return this.dfdy;
  }

  updateF(): void {}

  updateDfdy(y: GraphNode): void {}

  getRelationship(): NodeRelationship {
    return this.nodeRelationship;
  }
}

export default ConstantNode;
