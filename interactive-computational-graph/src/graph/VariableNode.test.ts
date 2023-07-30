import NodeRelationship from "./NodeRelationship";
import VariableNode from "./VariableNode";

describe("sequential testing of using node", () => {
  const varNode = new VariableNode("v1");

  test("1. should have correct id and initial value", () => {
    expect(varNode.getId()).toBe("v1");
    expect(varNode.getValue()).toBe(0);
  });

  test("2. should have correct value after setting", () => {
    varNode.setValue(1);

    expect(varNode.getValue()).toBe(1);
  });

  test("3. should have correct dfdy", () => {
    // d(v1)/d(v1) = 1
    expect(varNode.calculateDfdy(varNode)).toBe(1);
    // d(v1)/d(v2) = 0
    const varNode2 = new VariableNode("v2");
    expect(varNode.calculateDfdy(varNode2)).toBe(0);
  });

  test("4. can get relationship", () => {
    expect(varNode.getRelationship()).toBeInstanceOf(NodeRelationship);
  });
});
