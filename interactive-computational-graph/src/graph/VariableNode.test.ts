import NodeRelationship from "./NodeRelationship";
import VariableNode from "./VariableNode";

describe("sequential testing of using node", () => {
  const varNode = new VariableNode("v1");

  test("1. should have correct id and initial values", () => {
    expect(varNode.getId()).toBe("v1");
    expect(varNode.getValue()).toBe(0);
    expect(varNode.getDfdy()).toBe(0);
  });

  test("2. should have correct value after setting", () => {
    varNode.setValue(1);

    expect(varNode.getValue()).toBe(1);
  });

  test("3. should have correct dfdy after updating", () => {
    varNode.updateDfdy(varNode);
    expect(varNode.getDfdy()).toBe(1);

    const varNode2 = new VariableNode("v2");
    varNode.updateDfdy(varNode2);
    expect(varNode.getDfdy()).toBe(0);
  });

  test("4. can get relationship", () => {
    expect(varNode.getRelationship()).toBeInstanceOf(NodeRelationship);
  });
});
