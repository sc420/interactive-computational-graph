import NodeRelationship from "./NodeRelationship";
import VariableNode from "./VariableNode";

test("should have correct properties", () => {
  const varNode = new VariableNode("v1");
  expect(varNode.getId()).toBe("v1");
  expect(varNode.isConstant()).toBe(false);
  expect(varNode.getValue()).toBeCloseTo(0);
});

test("should have correct value after setting", () => {
  const varNode = new VariableNode("v1");
  varNode.setValue(1);
  expect(varNode.getValue()).toBeCloseTo(1);
});

test("should have correct dfdy", () => {
  const varNode = new VariableNode("v1");
  // d(v1)/d(v1) = 1
  expect(varNode.calculateDfdy(varNode)).toBeCloseTo(1);
  // d(v1)/d(v2) = 0
  const varNode2 = new VariableNode("v2");
  expect(varNode.calculateDfdy(varNode2)).toBeCloseTo(0);
});

test("can get relationship", () => {
  const varNode = new VariableNode("v1");
  expect(varNode.getRelationship()).toBeInstanceOf(NodeRelationship);
});
