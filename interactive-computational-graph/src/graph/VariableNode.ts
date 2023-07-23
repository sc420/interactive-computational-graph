import type GraphNode from "./GraphNode";
import NodeRelationship from "./NodeRelationship";

class VariableNode implements GraphNode {
  private readonly id: string;

  private readonly nodeRelationship: NodeRelationship = new NodeRelationship(
    [],
  );

  private value: number = 0;

  private dfdy: number = 0;

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

  updateDfdy(y: GraphNode): void {
    if (y.getId() === this.getId()) {
      this.dfdy = 1;
    } else {
      this.dfdy = 0;
    }
  }

  getRelationship(): NodeRelationship {
    return this.nodeRelationship;
  }
}

export default VariableNode;
