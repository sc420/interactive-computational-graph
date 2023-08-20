import type NodeRelationship from "./NodeRelationship";
import type NodeType from "./NodeType";

interface CoreNode {
  getType: () => NodeType;

  getId: () => string;

  isConstant: () => boolean;

  getValue: () => number;

  setValue: (value: number) => void;

  updateF: () => void;

  calculateDfdy: (y: CoreNode) => number;

  getRelationship: () => NodeRelationship;
}

export default CoreNode;
