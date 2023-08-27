import type NodeRelationship from "./NodeRelationship";
import type NodeType from "./NodeType";

interface CoreNode {
  getType: () => NodeType;

  getId: () => string;

  isConstant: () => boolean;

  getValue: () => string;

  setValue: (value: string) => void;

  updateF: () => void;

  calculateDfdx: (x: CoreNode) => string;

  getRelationship: () => NodeRelationship;
}

export default CoreNode;
