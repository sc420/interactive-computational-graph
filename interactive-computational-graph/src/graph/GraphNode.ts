import type NodeRelationship from "./NodeRelationship";

interface GraphNode {
  getId: () => string;

  getValue: () => number;

  setValue: (value: number) => void;

  getDfdy: () => number;

  updateF: () => void;

  updateDfdy: (y: GraphNode) => void;

  getRelationship: () => NodeRelationship;
}

export default GraphNode;
