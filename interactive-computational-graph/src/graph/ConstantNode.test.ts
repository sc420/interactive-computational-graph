import ConstantNode from "./ConstantNode";
import NodeRelationship from "./NodeRelationship";
import VariableNode from "./VariableNode";

describe("sequential testing of using node", () => {
  const constNode = new ConstantNode("c1");

  test("1. should have correct id and initial value", () => {
    expect(constNode.getId()).toBe("c1");
    expect(constNode.getValue()).toBe(0);
  });

  test("2. should have correct f after setting", () => {
    constNode.setValue(1);

    expect(constNode.getValue()).toBe(1);
  });

  test("3. should have correct dfdy", () => {
    // d(c1)/d(c1) = 0 (constant)
    expect(constNode.calculateDfdy(constNode)).toBe(0);
    // d(c1)/d(v1) = 0
    const varNode = new VariableNode("v1");
    expect(constNode.calculateDfdy(varNode)).toBe(0);
  });

  test("4. can get relationship", () => {
    expect(constNode.getRelationship()).toBeInstanceOf(NodeRelationship);
  });
});
