import NodeRelationship from "./NodeRelationship";
import VariableNode from "./VariableNode";

test("should have correct properties", () => {
  const varNode = new VariableNode("v1");
  expect(varNode.getType()).toBe("variable");
  expect(varNode.getId()).toBe("v1");
  expect(varNode.isConstant()).toBe(false);
  expect(varNode.getValue()).toBe("0");
});

test("should have correct value after setting", () => {
  const varNode = new VariableNode("v1");
  varNode.setValue("1");
  expect(varNode.getValue()).toBe("1");
});

test("should have correct dfdx", () => {
  const varNode = new VariableNode("v1");
  // d(v1)/d(v1) = 1
  expect(varNode.calculateDfdx(varNode)).toBe("1");
  // d(v1)/d(v2) = 0
  const varNode2 = new VariableNode("v2");
  expect(varNode.calculateDfdx(varNode2)).toBe("0");
});

test("can get relationship", () => {
  const varNode = new VariableNode("v1");
  expect(varNode.getRelationship()).toBeInstanceOf(NodeRelationship);
});

test("can save the state", () => {
  const varNode = new VariableNode("v1");
  varNode.setValue("3");
  const state = varNode.save();
  expect(state).toEqual(
    expect.objectContaining({
      nodeType: "variable",
      value: "3",
    }),
  );
});
