import type NodeRelationship from "./NodeRelationship";

interface GraphNode {
  getId: () => string;

  isConstant: () => boolean;

  getValue: () => number;

  setValue: (value: number) => void;

  updateF: () => void;

  calculateDfdy: (y: GraphNode) => number;

  getRelationship: () => NodeRelationship;
}

export default GraphNode;
