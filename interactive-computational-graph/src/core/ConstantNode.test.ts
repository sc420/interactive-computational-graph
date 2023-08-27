import ConstantNode from "./ConstantNode";
import NodeRelationship from "./NodeRelationship";
import VariableNode from "./VariableNode";

test("should have correct properties", () => {
  const constNode = new ConstantNode("c1");
  expect(constNode.getType()).toBe("CONSTANT");
  expect(constNode.getId()).toBe("c1");
  expect(constNode.isConstant()).toBe(true);
  expect(constNode.getValue()).toBe("0");
});

test("should have correct f after setting", () => {
  const constNode = new ConstantNode("c1");
  constNode.setValue("1");
  expect(constNode.getValue()).toBe("1");
});

test("updating f should do nothing", () => {
  const constNode = new ConstantNode("c1");
  constNode.setValue("1");
  constNode.updateF();
  expect(constNode.getValue()).toBe("1");
});

test("should have correct dfdy", () => {
  const constNode = new ConstantNode("c1");
  // d(c1)/d(c1) = 0 (constant)
  expect(constNode.calculateDfdx(constNode)).toBe("0");
  // d(c1)/d(v1) = 0
  const varNode = new VariableNode("v1");
  expect(constNode.calculateDfdx(varNode)).toBe("0");
});

test("can get relationship", () => {
  const constNode = new ConstantNode("c1");
  expect(constNode.getRelationship()).toBeInstanceOf(NodeRelationship);
});
