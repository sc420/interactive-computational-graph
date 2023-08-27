import ConstantNode from "./ConstantNode";
import {
  InputNodeAlreadyConnectedError,
  InputPortFullError,
} from "./CoreErrors";
import NodeRelationship from "./NodeRelationship";
import Operation from "./Operation";
import OperationNode from "./OperationNode";
import Port from "./Port";
import VariableNode from "./VariableNode";

describe("input behavior", () => {
  test("should have correct initial properties", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();

    expect(nodeRelationship.isInputPortEmpty("a")).toBe(true);
    expect(nodeRelationship.isInputPortEmpty("b")).toBe(true);

    expect(nodeRelationship.getInputNodesByPort("a")).toEqual([]);
    expect(nodeRelationship.getInputNodesByPort("b")).toEqual([]);

    expect(nodeRelationship.getInputNodes()).toEqual([]);

    expect(nodeRelationship.hasInputNodeByPort("a", "v1")).toBe(false);
  });

  test("should indicate if the input node is already connected", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();

    const varNode1 = new VariableNode("v1");
    nodeRelationship.addInputNodeByPort("a", varNode1);
    expect(() => {
      nodeRelationship.validateAddInputNodeByPort("a", varNode1.getId());
    }).toThrow(InputNodeAlreadyConnectedError);
  });

  test("should indicate if the input port is full", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();

    // Should not throw error when the port is empty
    const varNode1 = new VariableNode("v1");
    nodeRelationship.validateAddInputNodeByPort("a", varNode1.getId());
    nodeRelationship.validateAddInputNodeByPort("b", varNode1.getId());

    // Should throw error when the port is connected and multiple connections
    // isn't allowed
    nodeRelationship.addInputNodeByPort("a", varNode1);
    const varNode2 = new VariableNode("v2");
    expect(() => {
      nodeRelationship.validateAddInputNodeByPort("a", varNode2.getId());
    }).toThrow(InputPortFullError);

    // Should not throw error when multiple connections is allowed
    nodeRelationship.addInputNodeByPort("b", varNode1);
    nodeRelationship.validateAddInputNodeByPort("b", varNode2.getId());
  });

  test("Port a and b should have one input node after adding 1 node", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();

    const varNode1 = new VariableNode("v1");
    const constNode1 = new ConstantNode("c1");
    nodeRelationship.addInputNodeByPort("a", varNode1);
    nodeRelationship.addInputNodeByPort("b", constNode1);

    expect(nodeRelationship.isInputPortEmpty("a")).toBe(false);
    expect(nodeRelationship.isInputPortEmpty("b")).toBe(false);

    expect(nodeRelationship.getInputNodesByPort("a")).toEqual([varNode1]);
    expect(nodeRelationship.getInputNodesByPort("b")).toEqual([constNode1]);

    expect(nodeRelationship.hasInputNodeByPort("a", "v1")).toBe(true);
    expect(nodeRelationship.hasInputNodeByPort("b", "c1")).toBe(true);
  });

  test("should throw error when adding node to single-connection port", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const varNode1 = new VariableNode("v1");
    nodeRelationship.addInputNodeByPort("a", varNode1);

    const varNode2 = new VariableNode("v2");
    const addNodeToPortA = (): void => {
      nodeRelationship.addInputNodeByPort("a", varNode2);
    };
    expect(addNodeToPortA).toThrow(InputPortFullError);
    expect(addNodeToPortA).toThrow("Input port a doesn't allow multiple edges");
  });

  test("should throw error when the input node is already connected", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const varNode1 = new VariableNode("v1");
    nodeRelationship.addInputNodeByPort("a", varNode1);
    const addNodeToPortA = (): void => {
      nodeRelationship.addInputNodeByPort("a", varNode1);
    };
    expect(addNodeToPortA).toThrow(InputNodeAlreadyConnectedError);
    expect(addNodeToPortA).toThrow("Input node v1 already exists by port a");
  });

  test("Port b should have multiple input nodes after adding", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const varNode1 = new VariableNode("v1");
    const constNode2 = new ConstantNode("c1");
    nodeRelationship.addInputNodeByPort("b", varNode1);
    nodeRelationship.addInputNodeByPort("b", constNode2);

    const inputNodeIds = nodeRelationship
      .getInputNodesByPort("b")
      .map((node) => node.getId());
    const expectedInputNodeIds = ["v1", "c1"];
    expect(inputNodeIds.sort()).toEqual(expectedInputNodeIds.sort());

    expect(nodeRelationship.hasInputNodeByPort("b", "v1")).toBe(true);
    expect(nodeRelationship.hasInputNodeByPort("b", "c1")).toBe(true);
  });

  test("Port b should have one input node after removal", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const varNode1 = new VariableNode("v1");
    const varNode2 = new ConstantNode("v2");
    nodeRelationship.addInputNodeByPort("b", varNode1);
    nodeRelationship.addInputNodeByPort("b", varNode2);
    nodeRelationship.removeInputNodeByPort("b", "v2");

    expect(nodeRelationship.isInputPortEmpty("b")).toBe(false);

    expect(nodeRelationship.getInputNodesByPort("b")).toEqual([varNode1]);

    expect(nodeRelationship.hasInputNodeByPort("b", "v1")).toBe(true);
    expect(nodeRelationship.hasInputNodeByPort("b", "v2")).toBe(false);
  });

  test("Port a should have no input nodes after removal", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const varNode1 = new VariableNode("v1");
    nodeRelationship.addInputNodeByPort("a", varNode1);
    nodeRelationship.removeInputNodeByPort("a", "v1");

    expect(nodeRelationship.isInputPortEmpty("a")).toBe(true);

    expect(nodeRelationship.getInputNodesByPort("a")).toEqual([]);

    expect(nodeRelationship.hasInputNodeByPort("a", "v1")).toBe(false);
  });
});

describe("output behavior", () => {
  test("should have correct initial properties", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();

    expect(nodeRelationship.isOutputPortEmpty()).toBe(true);

    expect(nodeRelationship.getOutputNodes()).toEqual([]);
  });

  test("should throw error when removing non-existent node", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    expect(() => {
      nodeRelationship.removeOutputNode("op1");
    }).toThrow("Output node op1 doesn't exist");
  });

  test("should have one output node after adding", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const opNode1 = getDummyOperationNode("op1");
    nodeRelationship.addOutputNode(opNode1);

    expect(nodeRelationship.isOutputPortEmpty()).toBe(false);

    expect(nodeRelationship.getOutputNodes()).toEqual([opNode1]);
  });

  test("should have multiple different output nodes after adding", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const opNode1 = getDummyOperationNode("op1");
    const opNode2 = getDummyOperationNode("op2");
    nodeRelationship.addOutputNode(opNode1);
    nodeRelationship.addOutputNode(opNode2);

    expect(nodeRelationship.isOutputPortEmpty()).toBe(false);

    const outputNodeIds = nodeRelationship
      .getOutputNodes()
      .map((node) => node.getId());
    const expectedOutputNodeIds = ["op1", "op2"];
    expect(outputNodeIds.sort()).toEqual(expectedOutputNodeIds.sort());
  });

  test("should have multiple same output nodes after adding", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const opNode1 = getDummyOperationNode("op1");
    nodeRelationship.addOutputNode(opNode1);
    nodeRelationship.addOutputNode(opNode1);

    expect(nodeRelationship.isOutputPortEmpty()).toBe(false);

    const outputNodeIds = nodeRelationship
      .getOutputNodes()
      .map((node) => node.getId());
    const expectedOutputNodeIds = ["op1", "op1"];
    expect(outputNodeIds.sort()).toEqual(expectedOutputNodeIds.sort());
  });

  test("should have one output node after removal", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const opNode1 = getDummyOperationNode("op1");
    const opNode2 = getDummyOperationNode("op2");
    nodeRelationship.addOutputNode(opNode1);
    nodeRelationship.addOutputNode(opNode2);
    nodeRelationship.removeOutputNode("op2");

    expect(nodeRelationship.isOutputPortEmpty()).toBe(false);

    expect(nodeRelationship.getOutputNodes()).toEqual([opNode1]);
  });

  test("should have no output nodes after removing output node", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const opNode1 = getDummyOperationNode("op1");
    nodeRelationship.addOutputNode(opNode1);
    nodeRelationship.removeOutputNode("op1");

    expect(nodeRelationship.isOutputPortEmpty()).toBe(true);

    expect(nodeRelationship.getOutputNodes()).toEqual([]);
  });

  test("should have no output nodes after removing same output node twice", () => {
    const nodeRelationship = buildTwoPortsNodeRelationship();
    const opNode1 = getDummyOperationNode("op1");
    nodeRelationship.addOutputNode(opNode1);
    nodeRelationship.addOutputNode(opNode1);
    nodeRelationship.removeOutputNode("op1");
    nodeRelationship.removeOutputNode("op1");

    expect(nodeRelationship.isOutputPortEmpty()).toBe(true);

    expect(nodeRelationship.getOutputNodes()).toEqual([]);
  });

  function getDummyOperationNode(id: string): OperationNode {
    const op = new Operation("", "");
    return new OperationNode(id, [new Port("in1", false)], op);
  }
});

function buildTwoPortsNodeRelationship(): NodeRelationship {
  const ports = [new Port("a", false), new Port("b", true)];
  return new NodeRelationship(ports);
}
