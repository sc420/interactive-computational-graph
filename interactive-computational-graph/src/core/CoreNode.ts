import type CoreNodeState from "../states/CoreNodeState";
import type NodeRelationship from "./NodeRelationship";
import type NodeType from "./NodeType";

interface CoreNode {
  getType: () => NodeType;

  getId: () => string;

  isConstant: () => boolean;

  getValue: () => string;

  setValue: (value: string) => void;

  /**
   * Updates `f` value.
   */
  updateF: () => void;

  /**
   * Calculates partial derivative `df/dx`.
   * @param x Node for `dx` term.
   * @returns Partial derivative value.
   */
  calculateDfdx: (x: CoreNode) => string;

  getRelationship: () => NodeRelationship;

  save: () => CoreNodeState;
}

export default CoreNode;
