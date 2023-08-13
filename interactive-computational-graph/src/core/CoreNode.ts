import type NodeRelationship from "./NodeRelationship";

interface CoreNode {
  getId: () => string;

  isConstant: () => boolean;

  getValue: () => number;

  setValue: (value: number) => void;

  updateF: () => void;

  calculateDfdy: (y: CoreNode) => number;

  getRelationship: () => NodeRelationship;
}

export default CoreNode;
