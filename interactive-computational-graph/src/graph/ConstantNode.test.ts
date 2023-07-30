import ConstantNode from "./ConstantNode";
import NodeRelationship from "./NodeRelationship";

describe("sequential testing of using node", () => {
  const varNode = new ConstantNode("c1");

  test("1. should have correct id and initial values", () => {
    expect(varNode.getId()).toBe("c1");
    expect(varNode.getValue()).toBe(0);
    expect(varNode.getDfdy()).toBe(0);
  });

  test("2. should have correct value after setting", () => {
    varNode.setValue(1);

    expect(varNode.getValue()).toBe(1);
  });

  test("3. can get relationship", () => {
    expect(varNode.getRelationship()).toBeInstanceOf(NodeRelationship);
  });
});
