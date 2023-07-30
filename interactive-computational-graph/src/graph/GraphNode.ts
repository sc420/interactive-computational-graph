import type NodeRelationship from "./NodeRelationship";

interface GraphNode {
  getId: () => string;

  getValue: () => number;

  setValue: (value: number) => void;

  updateF: () => void;

  calculateDfdy: (y: GraphNode) => number;

  getRelationship: () => NodeRelationship;
}

export default GraphNode;
