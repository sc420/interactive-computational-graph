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

describe("sequential testing to manipulate a graph", () => {
  const graph = new Graph();
  const nodeIdToNodes = new Map<string, GraphNode>();

  test("1. should have correct initial properties", () => {
    expect(graph.getNodes()).toEqual([]);

    expect(graph.hasNode("v1")).toBe(false);
  });

  test("2. should throw error when referring non-existent node", () => {
    const nodeNotExistError = "Node v1 doesn't exist";

    expect(() => {
      graph.removeNode("v1");
    }).toThrow(nodeNotExistError);

    expect(() => {
      graph.connect("v1", "v2", "x");
    }).toThrow(nodeNotExistError);

    expect(() => {
      graph.disconnect("v1", "v2", "x");
    }).toThrow(nodeNotExistError);

    expect(() => {
      graph.setNodeValue("v1", 1);
    }).toThrow(nodeNotExistError);

    expect(() => {
      graph.setTargetNode("v1");
    }).toThrow(nodeNotExistError);
  });

  test("3. should have one node after adding one", () => {
    const varNode1 = new VariableNode("v1");
    graph.addNode(varNode1);
    nodeIdToNodes.set(varNode1.getId(), varNode1);

    expect(graph.getNodes()).toEqual(nodeIdToNodes.values()); // TODO(sc420): just check node IDS and sort

    expect(graph.getOneNode("v1")).toEqual(varNode1);

    expect(graph.hasNode("v1")).toBe(true);
  });

  test("4. should throw error when referring another non-existent node", () => {
    const nodeNotExistError = "Node v2 doesn't exist";

    expect(() => {
      graph.connect("v1", "v2", "x");
    }).toThrow(nodeNotExistError);

    expect(() => {
      graph.disconnect("v1", "v2", "x");
    }).toThrow(nodeNotExistError);
  });

  test("5. should have two nodes after adding one", () => {
    const varNode2 = new VariableNode("v2");
    graph.addNode(varNode2);
    nodeIdToNodes.set(varNode2.getId(), varNode2);

    const varNode1 = nodeIdToNodes.get("v1");
    expect(graph.getNodes()).toEqual([varNode1, varNode2]); // TODO(sc420): just check node IDS and sort

    expect(graph.getOneNode("v2")).toEqual(varNode2);

    expect(graph.hasNode("v1")).toBe(true);
    expect(graph.hasNode("v2")).toBe(true);
  });

  test("6. should have multiple nodes after adding some", () => {
    const constNode1 = new ConstantNode("c1");
    const sumNode1 = buildSumNode("sum1");
    const sumNode2 = buildSumNode("sum2");
    const productNode1 = buildProductNode("product1");
    const identityNode1 = buildIdentityNode("identity1");
    const newNodes = [
      constNode1,
      sumNode1,
      sumNode2,
      productNode1,
      identityNode1,
    ];

    newNodes.forEach((node) => {
      graph.addNode(node);
      nodeIdToNodes.set(node.getId(), node);
    });

    const varNode1 = nodeIdToNodes.get("v1");
    const varNode2 = nodeIdToNodes.get("v2");
    expect(graph.getNodes()).toEqual([varNode1, varNode2, ...newNodes]); // TODO(sc420): just check node IDS and sort

    expect(graph.getOneNode("c1")).toEqual(constNode1);
    expect(graph.getOneNode("sum1")).toEqual(sumNode1);
    expect(graph.getOneNode("sum2")).toEqual(sumNode2);
    expect(graph.getOneNode("product1")).toEqual(productNode1);
    expect(graph.getOneNode("identity1")).toEqual(identityNode1);

    expect(graph.hasNode("c1")).toBe(true);
    expect(graph.hasNode("sum1")).toBe(true);
    expect(graph.hasNode("sum2")).toBe(true);
    expect(graph.hasNode("product1")).toBe(true);
    expect(graph.hasNode("identity1")).toBe(true);
  });

  test("7. should throw error when connecting to non-existent port", () => {
    expect(() => {
      graph.connect("sum1", "v1", "x");
    }).toThrow("Input port x doesn't exist");
  });

  test("8. should connect nodes successfully", () => {
    graph.connect("v1", "sum1", "x_i");
    graph.connect("v2", "sum1", "x_i");
    graph.connect("v2", "sum2", "x_i");
    graph.connect("c1", "sum2", "x_i");

    graph.connect("sum1", "product1", "x_i");
    graph.connect("sum2", "product1", "x_i");

    graph.connect("product1", "identity1", "x");
  });

  test("9. should throw error when connecting to single-connection port", () => {
    expect(() => {
      graph.connect("sum1", "identity1", "x");
    }).toThrow("Input port x doesn't allow multiple edges");

    // Should not be half-connected
    const sumNode1 = nodeIdToNodes.get("sum1");
    const productNode1 = nodeIdToNodes.get("product1");
    const identityNode1 = nodeIdToNodes.get("identity1");
    expect(sumNode1?.getRelationship().getOutputNodes()).toEqual([
      productNode1,
    ]);
    expect(identityNode1?.getRelationship().isInputPortEmpty("x")).toBe(true);
  });

  test("10. should throw error when the graph will not be DAG", () => {
    expect(() => {
      graph.connect("identity1", "sum1", "x_i");
    }).toThrow("Connecting node identity1 to node sum1 would have cycle");
  });

  test("11. should remove connections automatically when removing nodes", () => {
    graph.removeNode("sum1");
    nodeIdToNodes.delete("sum1");

    expect(graph.hasNode("sum1")).toBe(false);

    const varNode1 = nodeIdToNodes.get("v1");
    const varNode2 = nodeIdToNodes.get("v2");
    const productNode1 = nodeIdToNodes.get("op");
    const sumNode2 = nodeIdToNodes.get("sum2");
    expect(varNode1?.getRelationship().isOutputPortEmpty()).toBe(true);
    expect(varNode2?.getRelationship().isOutputPortEmpty()).toBe(true);
    expect(productNode1?.getRelationship().getInputNodesByPort("x_i")).toEqual([
      sumNode2,
    ]);
  });

  test("12. should disconnect nodes successfully", () => {
    graph.disconnect("v2", "sum2", "x_i");
    graph.disconnect("c1", "sum2", "x_i");
    graph.disconnect("sum2", "product1", "x_i");
    graph.disconnect("product1", "identity1", "x");
  });

  test("13. should remove nodes successfully", () => {
    graph.removeNode("v1");
    graph.removeNode("v2");
    graph.removeNode("c1");
    graph.removeNode("sum2");
    graph.removeNode("product1");
    graph.removeNode("identity1");

    nodeIdToNodes.clear();
  });
});

describe("updating f values", () => {
  test("updating operation node values should fail", () => {
    const graph = new Graph();
    const sumNode1 = buildSumNode("sum1");
    graph.addNode(sumNode1);

    expect(() => {
      graph.setNodeValue("sum1", 5);
    }).toThrow("Operation node should only update f, not set a value");
  });

  test("should update f values for small graph", () => {
    const graph = buildSmallGraph();

    graph.setNodeValue("v1", 0);

    const updatedNodes = graph.updateFValuesFrom("v1");
    const expectedUpdatedNodes = new Set<string>(["v1", "sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);
    expect(graph.getNodeValue("sum1")).toBeCloseTo(1);
  });

  test("should update f values for medium graph", () => {
    const graph = buildMediumGraph();

    // Update all f values
    let updatedNodes = graph.updateFValues();
    let expectedUpdatedNodes = new Set<string>([
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

    // Update f values from one node
    graph.setNodeValue("v1", 0);
    updatedNodes = graph.updateFValuesFrom("v1");
    expectedUpdatedNodes = new Set<string>([
      "v1",
      "sum1",
      "product1",
      "identity1",
    ]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);
    expect(graph.getNodeValue("sum1")).toBeCloseTo(1);
    expect(graph.getNodeValue("sum2")).toBeCloseTo(2);
    expect(graph.getNodeValue("product1")).toBeCloseTo(10);
    expect(graph.getNodeValue("identity1")).toBeCloseTo(10);
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
