import ConstantNode from "./ConstantNode";
import type GraphNode from "./GraphNode";
import NodeRelationship from "./NodeRelationship";
import Operation from "./Operation";
import OperationNode from "./OperationNode";
import Port from "./Port";
import VariableNode from "./VariableNode";

test("should indicate if we can add input node by port", () => {
  const nodeRelationship = buildTwoPortsNodeRelationship();

  // Should be true when the port is empty
  expect(nodeRelationship.canAddInputNodeByPort("a")).toBe(true);
  expect(nodeRelationship.canAddInputNodeByPort("b")).toBe(true);

  // Should be false when the port is connected and multiple connections isn't
  // allowed
  const varNode1 = new VariableNode("v1");
  nodeRelationship.addInputNodeByPort("a", varNode1);
  expect(nodeRelationship.canAddInputNodeByPort("a")).toBe(false);

  // Should be true when multiple connections is allowed
  nodeRelationship.addInputNodeByPort("b", varNode1);
  expect(nodeRelationship.canAddInputNodeByPort("b")).toBe(true);
});

describe("sequential testing to check input behavior", () => {
  let nodeRelationship: NodeRelationship;
  let aInputNodes: GraphNode[] = [];
  let bInputNodes: GraphNode[] = [];

  beforeAll(() => {
    const ports = [new Port("a", false), new Port("b", true)];
    nodeRelationship = new NodeRelationship(ports);
  });

  test("1. should have correct initial properties", () => {
    expect(nodeRelationship.isInputPortEmpty("a")).toBe(true);
    expect(nodeRelationship.isInputPortEmpty("b")).toBe(true);

    expect(nodeRelationship.getInputNodesByPort("a")).toEqual([]);
    expect(nodeRelationship.getInputNodesByPort("b")).toEqual([]);

    expect(nodeRelationship.getInputNodes()).toEqual([]);

    expect(nodeRelationship.hasInputNodeByPort("a", "v1")).toBe(false);
  });

  test("2. Port a and b should have one input node after adding 1 node", () => {
    const varNode1 = new VariableNode("v1");
    const constNode1 = new ConstantNode("c1");
    nodeRelationship.addInputNodeByPort("a", varNode1);
    nodeRelationship.addInputNodeByPort("b", constNode1);
    aInputNodes.push(varNode1);
    bInputNodes.push(constNode1);

    expect(nodeRelationship.isInputPortEmpty("a")).toBe(false);
    expect(nodeRelationship.isInputPortEmpty("b")).toBe(false);

    expect(nodeRelationship.getInputNodesByPort("a")).toEqual(aInputNodes);
    expect(nodeRelationship.getInputNodesByPort("b")).toEqual(bInputNodes);

    checkInputNodes();

    expect(nodeRelationship.hasInputNodeByPort("a", "v1")).toBe(true);
    expect(nodeRelationship.hasInputNodeByPort("b", "c1")).toBe(true);
  });

  test("3. should throw error when adding node to single-connection port", () => {
    const varNode2 = new VariableNode("v2");

    expect(() => {
      nodeRelationship.addInputNodeByPort("a", varNode2);
    }).toThrow("Input port a doesn't allow multiple edges");
  });

  test("4. should throw error when adding existing node", () => {
    expect(() => {
      nodeRelationship.addInputNodeByPort("a", aInputNodes[0]);
    }).toThrow("Input node v1 already exists by port a");

    expect(() => {
      nodeRelationship.addInputNodeByPort("b", bInputNodes[0]);
    }).toThrow("Input node c1 already exists by port b");
  });

  test("5. Port b should have multiple input nodes after adding", () => {
    const constNode2 = new ConstantNode("c2");
    nodeRelationship.addInputNodeByPort("b", constNode2);
    bInputNodes.push(constNode2);

    expect(nodeRelationship.isInputPortEmpty("b")).toBe(false);

    expect(nodeRelationship.getInputNodesByPort("b")).toEqual(bInputNodes);

    checkInputNodes();

    expect(nodeRelationship.hasInputNodeByPort("b", "c1")).toBe(true);
    expect(nodeRelationship.hasInputNodeByPort("b", "c2")).toBe(true);
  });

  test("6. Port b should have one input node after removal", () => {
    nodeRelationship.removeInputNodeByPort("b", "c1");
    bInputNodes = [bInputNodes[1]];

    expect(nodeRelationship.isInputPortEmpty("b")).toBe(false);

    expect(nodeRelationship.getInputNodesByPort("b")).toEqual(bInputNodes);

    checkInputNodes();

    expect(nodeRelationship.hasInputNodeByPort("b", "c1")).toBe(false);
    expect(nodeRelationship.hasInputNodeByPort("b", "c2")).toBe(true);
  });

  test("7. Port a should have no input nodes after removal", () => {
    nodeRelationship.removeInputNodeByPort("a", "v1");
    aInputNodes = [];

    expect(nodeRelationship.isInputPortEmpty("a")).toBe(true);

    expect(nodeRelationship.getInputNodesByPort("a")).toEqual(aInputNodes);

    checkInputNodes();

    expect(nodeRelationship.hasInputNodeByPort("a", "v1")).toBe(false);
  });

  function checkInputNodes(): void {
    const aInputNodeIds = aInputNodes.map((node) => node.getId());
    const bInputNodeIds = bInputNodes.map((node) => node.getId());
    const expectedInputNodeIds = [...aInputNodeIds, ...bInputNodeIds];

    const inputNodes = nodeRelationship.getInputNodes();
    const inputNodeIds = inputNodes.map((node) => node.getId());

    expect(inputNodeIds.sort()).toEqual(expectedInputNodeIds.sort());
  }
});

describe("sequential testing to check output behavior", () => {
  let nodeRelationship: NodeRelationship;
  let outputNodes: GraphNode[] = [];

  beforeAll(() => {
    nodeRelationship = new NodeRelationship([]);
  });

  test("1. should have correct initial properties", () => {
    expect(nodeRelationship.isOutputPortEmpty()).toBe(true);

    expect(nodeRelationship.getOutputNodes()).toEqual([]);
  });

  test("2. should throw error when removing non-existent node", () => {
    expect(() => {
      nodeRelationship.removeOutputNode("op1");
    }).toThrow("Output node op1 doesn't exist");
  });

  test("3. should have one output node after adding", () => {
    const opNode1 = getDummyOperationNode("op1");
    nodeRelationship.addOutputNode(opNode1);
    outputNodes.push(opNode1);

    expect(nodeRelationship.isOutputPortEmpty()).toBe(false);

    expect(nodeRelationship.getOutputNodes()).toEqual(outputNodes);
  });

  test("4. should have multiple output nodes after adding", () => {
    const opNode2 = getDummyOperationNode("op2");
    nodeRelationship.addOutputNode(opNode2);
    outputNodes.push(opNode2);

    expect(nodeRelationship.isOutputPortEmpty()).toBe(false);

    expect(nodeRelationship.getOutputNodes()).toEqual(outputNodes);
  });

  test("5. should have one output node after removal", () => {
    nodeRelationship.removeOutputNode("op1");
    outputNodes = [outputNodes[1]];

    expect(nodeRelationship.isOutputPortEmpty()).toBe(false);

    expect(nodeRelationship.getOutputNodes()).toEqual(outputNodes);
  });

  test("6. should have no output nodes after removal", () => {
    nodeRelationship.removeOutputNode("op2");

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
