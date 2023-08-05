import ConstantNode from "./ConstantNode";
import Graph from "./Graph";
import type GraphNode from "./GraphNode";
import Operation from "./Operation";
import OperationNode from "./OperationNode";
import Port from "./Port";
import VariableNode from "./VariableNode";
import {
  IDENTITY_DFDY_CODE,
  IDENTITY_F_CODE,
  PRODUCT_DFDY_CODE,
  PRODUCT_F_CODE,
  SUM_DFDY_CODE,
  SUM_F_CODE,
} from "./test_utils";

describe("manipulating the graph", () => {
  test("should get a list of nodes", () => {
    const emptyGraph = new Graph();
    expect(emptyGraph.getNodes()).toEqual([]);

    const smallGraph = buildSmallGraph();
    const nodeIds = smallGraph.getNodes().map((node) => node.getId());
    expect(nodeIds.sort()).toEqual(["v1", "v2", "sum1"].sort());
  });

  test("node should exist after adding", () => {
    const graph = new Graph();
    const varNode1 = new VariableNode("v1");
    graph.addNode(varNode1);

    expect(graph.getNodes()).toEqual([varNode1]);
    expect(graph.getOneNode("v1")).toEqual(varNode1);
    expect(graph.hasNode("v1")).toBe(true);
  });

  test("should throw error when referring non-existent node", () => {
    const emptyGraph = new Graph();
    const nodeNotExistError = "Node v1 doesn't exist";

    expect(() => {
      emptyGraph.removeNode("v1");
    }).toThrow(nodeNotExistError);

    expect(() => {
      emptyGraph.connect("v1", "v2", "x");
    }).toThrow(nodeNotExistError);

    expect(() => {
      emptyGraph.disconnect("v1", "v2", "x");
    }).toThrow(nodeNotExistError);

    expect(() => {
      emptyGraph.setNodeValue("v1", 1);
    }).toThrow(nodeNotExistError);

    expect(() => {
      emptyGraph.setTargetNode("v1");
    }).toThrow(nodeNotExistError);
  });

  test("should throw error when referring another non-existent node", () => {
    const graph = buildSmallGraph();
    const nodeNotExistError = "Node v3 doesn't exist";

    expect(() => {
      graph.connect("v1", "v3", "x");
    }).toThrow(nodeNotExistError);

    expect(() => {
      graph.disconnect("v1", "v3", "x");
    }).toThrow(nodeNotExistError);
  });

  test("should disconnect successfully", () => {
    const graph = buildSmallGraph();

    graph.disconnect("v1", "sum1", "x_i");
    graph.disconnect("v2", "sum1", "x_i");

    const varNode1 = graph.getOneNode("v1");
    const varNode2 = graph.getOneNode("v2");
    const sumNode1 = graph.getOneNode("sum1");
    expect(varNode1.getRelationship().isOutputPortEmpty()).toBe(true);
    expect(varNode2.getRelationship().isOutputPortEmpty()).toBe(true);
    expect(sumNode1.getRelationship().isInputPortEmpty("x_i")).toBe(true);
  });

  test("should remove connections automatically when removing nodes", () => {
    const graph = buildSmallGraph();

    graph.removeNode("sum1");

    const varNode1 = graph.getOneNode("v1");
    const varNode2 = graph.getOneNode("v2");
    expect(varNode1.getRelationship().isOutputPortEmpty()).toBe(true);
    expect(varNode2.getRelationship().isOutputPortEmpty()).toBe(true);
  });

  test("should throw error when connecting the same edge again", () => {
    const graph = buildSmallGraph();

    expect(() => {
      graph.connect("v1", "sum1", "x_i");
    }).toThrow("Output node sum1 already exists");
  });

  test("should throw error when connecting to non-existent port", () => {
    const graph = buildSmallGraph();
    const varNode3 = new VariableNode("v3");
    graph.addNode(varNode3);

    expect(() => {
      graph.connect("v3", "sum1", "x");
    }).toThrow("Input port x doesn't exist");
  });

  test("should throw error when connecting to single-connection port", () => {
    const graph = buildMediumGraph();
    const varNode4 = new VariableNode("v4");
    graph.addNode(varNode4);

    expect(() => {
      graph.connect("v4", "identity1", "x");
    }).toThrow(`Couldn't add to input port x of node identity1,
 please check if the port allows multiple edges`);

    // Should not be half-connected
    const identityNode1 = graph.getOneNode("identity1");
    expect(varNode4.getRelationship().isOutputPortEmpty()).toBe(true);
    expect(
      identityNode1.getRelationship().getInputNodesByPort("x"),
    ).toHaveLength(1);
  });

  test("should throw error when the graph will not be DAG", () => {
    const graph = buildMediumGraph();

    expect(() => {
      graph.connect("identity1", "sum1", "x_i");
    }).toThrow("Connecting node identity1 to node sum1 would have cycle");

    expect(() => {
      graph.connect("identity1", "identity1", "x");
    }).toThrow("Connecting node identity1 to node identity1 would have cycle");
  });
});

describe("setting node values", () => {
  test("updating non-operation node values should success", () => {
    const graph = buildSmallGraph();

    graph.setNodeValue("v1", 10);
    graph.setNodeValue("v2", 20);

    expect(graph.getNodeValue("v1")).toBeCloseTo(10);
    expect(graph.getNodeValue("v2")).toBeCloseTo(20);
  });

  test("updating operation node values should fail", () => {
    const graph = new Graph();
    const sumNode1 = buildSumNode("sum1");
    graph.addNode(sumNode1);

    expect(() => {
      graph.setNodeValue("sum1", 5);
    }).toThrow("Operation node should only update f, not set a value");
  });
});

describe("updating f values", () => {
  test("should update f values for small graph", () => {
    const graph = buildSmallGraph();

    const updatedNodes = graph.updateFValues();
    const expectedUpdatedNodes = new Set<string>(["v1", "v2", "sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);
    expect(graph.getNodeValue("sum1")).toBeCloseTo(3);
  });

  test("should update f values for medium graph", () => {
    const graph = buildMediumGraph();

    const updatedNodes = graph.updateFValues();
    const expectedUpdatedNodes = new Set<string>([
      "v1",
      "v2",
      "c1",
      "sum1",
      "sum2",
      "v3",
      "product1",
      "identity1",
    ]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);
    expect(graph.getNodeValue("sum1")).toBeCloseTo(3);
    expect(graph.getNodeValue("sum2")).toBeCloseTo(2);
    expect(graph.getNodeValue("product1")).toBeCloseTo(30);
    expect(graph.getNodeValue("identity1")).toBeCloseTo(30);
  });
});

describe("updating derivative values", () => {
  test("should update derivatives in reverse mode for small graph", () => {
    const graph = buildSmallGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("REVERSE");

    graph.setTargetNode("v1");
    let updatedNodes = graph.updateDerivatives();
    let expectedUpdatedNodes = new Set<string>(["v1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);
    // d(v1)/d(v1) = 1
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(1);
    // not in the reverse path
    expect(graph.getNodeDerivative("v2")).toBeCloseTo(0);
    // not in the reverse path
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(0);

    graph.setTargetNode("sum1");
    updatedNodes = graph.updateDerivatives();
    expectedUpdatedNodes = new Set<string>(["v1", "v2", "sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);
    // d(sum1)/d(v1) = 1
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(1);
    // d(sum1)/d(v2) = 1
    expect(graph.getNodeDerivative("v2")).toBeCloseTo(1);
    // d(sum1)/d(sum1) = 1
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(1);
  });

  test("should update derivatives in forward mode for small graph", () => {
    const graph = buildSmallGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("FORWARD");

    graph.setTargetNode("v1");
    let updatedNodes = graph.updateDerivatives();
    let expectedUpdatedNodes = new Set<string>(["v1", "sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);
    // d(v1)/d(v1) = 1
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(1);
    // not in the forward path
    expect(graph.getNodeDerivative("v2")).toBeCloseTo(0);
    // d(sum1)/d(v1) = 1
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(1);

    graph.setTargetNode("sum1");
    updatedNodes = graph.updateDerivatives();
    expectedUpdatedNodes = new Set<string>(["sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);
    // not in the forward path
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(0);
    // not in the forward path
    expect(graph.getNodeDerivative("v2")).toBeCloseTo(0);
    // d(sum1)/d(sum1) = 1
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(1);
  });

  test("should update derivatives in reverse mode for medium graph", () => {
    const graph = buildMediumGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("REVERSE");
    graph.setTargetNode("identity1");

    const updatedNodes = graph.updateDerivatives();
    const expectedUpdatedNodes = new Set<string>([
      "v1",
      "v2",
      "c1",
      "sum1",
      "sum2",
      "v3",
      "product1",
      "identity1",
    ]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);

    // d(identity1)/d(identity1) = 1
    expect(graph.getNodeDerivative("identity1")).toBeCloseTo(1);
    // d(identity1)/d(product1) = 1
    expect(graph.getNodeDerivative("product1")).toBeCloseTo(1);
    // d(identity1)/d(sum1) = d(product1)/d(sum1) = sum2 * v3 = 2 * 5 = 10
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(10);
    // d(identity1)/d(sum2) = d(product1)/d(sum2) = sum1 * v3 = 3 * 5 = 15
    expect(graph.getNodeDerivative("sum2")).toBeCloseTo(15);
    // d(identity1)/d(v3) = d(product1)/d(v3) = sum1 * sum2 = 6
    expect(graph.getNodeDerivative("v3")).toBeCloseTo(6);
    // d(identity1)/d(v1) = d(sum1)/d(v1) * d(product1)/d(sum1) = 1 * 10 = 10
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(10);
    // d(identity1)/d(v2) = d(sum1)/d(v2) * d(product1)/d(sum1) +
    // d(sum2)/d(v2) * d(product1)/d(sum2) = 1 * 10 + 1 * 15 = 25
    expect(graph.getNodeDerivative("v2")).toBeCloseTo(25);
    //  d(identity1)/d(c1) = 0 (constant)
    expect(graph.getNodeDerivative("c1")).toBeCloseTo(0);
  });

  test("should update derivatives in forward mode for medium graph", () => {
    const graph = buildMediumGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("FORWARD");
    graph.setTargetNode("v2");

    const updatedNodes = graph.updateDerivatives();
    const expectedUpdatedNodes = new Set<string>([
      "v2",
      "sum1",
      "sum2",
      "product1",
      "identity1",
    ]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);

    // not in the forward path
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(0);
    // d(v2)/d(v2) = 1
    expect(graph.getNodeDerivative("v2")).toBeCloseTo(1);
    // d(c1)/d(v2) = 0 (constant)
    expect(graph.getNodeDerivative("c1")).toBeCloseTo(0);
    // d(sum1)/d(v2) = d(v1)/d(v2) * d(sum1)/d(v1) +
    // d(v2)/d(v2) * d(sum1)/d(v2) = 0 * 1 + 1 * 1 = 1
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(1);
    // d(sum2)/d(v2) = d(v2)/d(v2) * d(sum2)/d(v2) +
    // d(c1)/d(v2) * d(sum2)/d(c1) = 1 * 1 + 0 * 0 = 1
    expect(graph.getNodeDerivative("sum2")).toBeCloseTo(1);
    // not in the forward path
    expect(graph.getNodeDerivative("v3")).toBeCloseTo(0);
    // d(product1)/d(v2) = d(sum1)/d(v2) * d(product1)/d(sum1) +
    // d(sum2)/d(v2) * d(product1)/d(sum2) +
    // d(v3)/d(v2) * d(product1)/d(v3) =
    // 1 * (sum2 * v3) + 1 * (sum1 * v3) + 0 * (sum1 * sum2) = 25
    expect(graph.getNodeDerivative("product1")).toBeCloseTo(25);
    // d(identity1)/d(v2) = d(product1)/d(v2) * d(identity1)/d(product1) =
    // 25 * 1 = 25
    expect(graph.getNodeDerivative("identity1")).toBeCloseTo(25);
  });
});

function buildSmallGraph(): Graph {
  const graph = new Graph();

  // Layer 1
  const varNode1 = new VariableNode("v1");
  const varNode2 = new VariableNode("v2");
  // Layer 2
  const sumNode1 = buildSumNode("sum1");
  const newNodes = [varNode1, varNode2, sumNode1];

  // Add the nodes
  newNodes.forEach((newNode) => {
    graph.addNode(newNode);
  });

  // Layer 1 connections
  graph.connect(varNode1.getId(), sumNode1.getId(), "x_i");
  graph.connect(varNode2.getId(), sumNode1.getId(), "x_i");
  // Layer 1 initial values
  graph.setNodeValue(varNode1.getId(), 2);
  graph.setNodeValue(varNode2.getId(), 1);

  return graph;
}

function buildMediumGraph(): Graph {
  const graph = new Graph();

  // Layer 1
  const varNode1 = new VariableNode("v1");
  const varNode2 = new VariableNode("v2");
  const constNode1 = new ConstantNode("c1");
  // Layer 2
  const sumNode1 = buildSumNode("sum1");
  const sumNode2 = buildSumNode("sum2");
  // Layer 3
  const productNode1 = buildProductNode("product1");
  const varNode3 = new VariableNode("v3");
  // Layer 4
  const identityNode1 = buildIdentityNode("identity1");
  const newNodes = [
    varNode1,
    varNode2,
    constNode1,
    sumNode1,
    sumNode2,
    productNode1,
    varNode3,
    identityNode1,
  ];

  // Add the nodes
  newNodes.forEach((newNode) => {
    graph.addNode(newNode);
  });

  // Layer 1 connections
  graph.connect(varNode1.getId(), sumNode1.getId(), "x_i");
  graph.connect(varNode2.getId(), sumNode1.getId(), "x_i");
  graph.connect(varNode2.getId(), sumNode2.getId(), "x_i");
  graph.connect(constNode1.getId(), sumNode2.getId(), "x_i");
  // Layer 2 connections
  graph.connect(sumNode1.getId(), productNode1.getId(), "x_i");
  graph.connect(sumNode2.getId(), productNode1.getId(), "x_i");
  graph.connect(varNode3.getId(), productNode1.getId(), "x_i");
  // Layer 3 connections
  graph.connect(productNode1.getId(), identityNode1.getId(), "x");

  // Layer 1 initial values
  graph.setNodeValue(varNode1.getId(), 2);
  graph.setNodeValue(varNode2.getId(), 1);
  graph.setNodeValue(constNode1.getId(), 1);
  // Layer 2 initial values
  graph.setNodeValue(varNode3.getId(), 5);

  return graph;
}

function buildSumNode(id: string): GraphNode {
  const ports: Port[] = [new Port("x_i", true)];
  const operation = new Operation(SUM_F_CODE, SUM_DFDY_CODE);
  return new OperationNode(id, ports, operation);
}

function buildProductNode(id: string): GraphNode {
  const ports: Port[] = [new Port("x_i", true)];
  const operation = new Operation(PRODUCT_F_CODE, PRODUCT_DFDY_CODE);
  return new OperationNode(id, ports, operation);
}

function buildIdentityNode(id: string): GraphNode {
  const ports: Port[] = [new Port("x", false)];
  const operation = new Operation(IDENTITY_F_CODE, IDENTITY_DFDY_CODE);
  return new OperationNode(id, ports, operation);
}
