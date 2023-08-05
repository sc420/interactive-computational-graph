import type GraphNode from "./GraphNode";
import Operation from "./Operation";
import OperationNode from "./OperationNode";
import Port from "./Port";
import VariableNode from "./VariableNode";
import { SUM_DFDY_CODE, SUM_F_CODE } from "./test_utils";

describe("sequential testing of using node", () => {
  const ports: Port[] = [new Port("x_i", true)];
  const operation = new Operation(SUM_F_CODE, SUM_DFDY_CODE);
  const opNode = new OperationNode("op1", ports, operation);
  let varNode1: GraphNode;

  test("1. should have correct ID and initial value", () => {
    expect(opNode.getId()).toBe("op1");
    expect(opNode.isConstant()).toBe(false);
    expect(opNode.getValue()).toBe(0);
  });

  test("2. should throw error when setting value", () => {
    expect(() => {
      opNode.setValue(1);
    }).toThrow("Operation node should only update f, not set a value");
  });

  test("3. should add input nodes successfully", () => {
    varNode1 = new VariableNode("v1");
    const varNode2 = new VariableNode("v2");
    const varNode3 = new VariableNode("v3");

    varNode1.setValue(1);
    varNode2.setValue(2);
    varNode3.setValue(3);

    opNode.getRelationship().addInputNodeByPort("x_i", varNode1);
    opNode.getRelationship().addInputNodeByPort("x_i", varNode2);
    opNode.getRelationship().addInputNodeByPort("x_i", varNode3);
  });

  test("4. should have correct f after updating", () => {
    opNode.updateF();

    // 1 + 2 + 3 = 6
    expect(opNode.getValue()).toBe(6);
  });

  test("5. should have correct dfdy", () => {
    // d(op1)/d(v1) = 1
    expect(opNode.calculateDfdy(varNode1)).toBe(1);
    // d(op1)/d(op1) = 1
    expect(opNode.calculateDfdy(opNode)).toBe(1);
    // d(op1)/d(v4) = 0
    const varNode4 = new VariableNode("v4");
    expect(opNode.calculateDfdy(varNode4)).toBe(0);
  });
});