import { SUM_DFDX_CODE, SUM_F_CODE } from "../features/BuiltInCode";
import NodeRelationship from "./NodeRelationship";
import Operation from "./Operation";
import OperationNode from "./OperationNode";
import Port from "./Port";
import VariableNode from "./VariableNode";

test("should have correct properties", () => {
  const sumNode = buildSumNode();
  expect(sumNode.getType()).toBe("operation");
  expect(sumNode.getId()).toBe("op1");
  expect(sumNode.isConstant()).toBe(false);
  expect(sumNode.getValue()).toBe("0");
});

test("should throw error when setting value", () => {
  const sumNode = buildSumNode();
  expect(() => {
    sumNode.setValue("1");
  }).toThrow("Operation node should only update f, not set a value");
});

test("should have correct f after updating", () => {
  const sumNode = buildSumNode();
  const varNode1 = new VariableNode("v1");
  const varNode2 = new VariableNode("v2");
  const varNode3 = new VariableNode("v3");
  varNode1.setValue("1");
  varNode2.setValue("2");
  varNode3.setValue("3");
  sumNode.getRelationship().addInputNodeByPort("x_i", varNode1);
  sumNode.getRelationship().addInputNodeByPort("x_i", varNode2);
  sumNode.getRelationship().addInputNodeByPort("x_i", varNode3);

  // 1 + 2 + 3 = 6
  sumNode.updateF();
  expect(parseFloat(sumNode.getValue())).toBeCloseTo(6);
});

test("should have correct dfdx", () => {
  const sumNode = buildSumNode();
  const varNode1 = new VariableNode("v1");
  varNode1.setValue("1");
  sumNode.getRelationship().addInputNodeByPort("x_i", varNode1);

  // d(op1)/d(v1) = 1
  expect(parseFloat(sumNode.calculateDfdx(varNode1))).toBeCloseTo(1);
  // d(op1)/d(op1) = 1
  expect(parseFloat(sumNode.calculateDfdx(sumNode))).toBeCloseTo(1);
  // d(op1)/d(v4) = 0
  const varNode4 = new VariableNode("v4");
  expect(parseFloat(sumNode.calculateDfdx(varNode4))).toBeCloseTo(0);
});

test("can get relationship", () => {
  const sumNode = buildSumNode();
  expect(sumNode.getRelationship()).toBeInstanceOf(NodeRelationship);
});

test("can save the state", () => {
  const sumNode = buildSumNode();
  const state = sumNode.save();
  expect(state).toEqual(
    expect.objectContaining({
      nodeType: "operation",
      operationId: "sum",
    }),
  );
});

function buildSumNode(): OperationNode {
  const ports: Port[] = [new Port("x_i", true)];
  const operation = new Operation(SUM_F_CODE, SUM_DFDX_CODE);
  return new OperationNode("op1", ports, "sum", operation);
}
