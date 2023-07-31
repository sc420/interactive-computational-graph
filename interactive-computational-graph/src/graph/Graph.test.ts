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
    expect(graph.getNodes()).toEqual([varNode1, varNode2, ...newNodes]);  // TODO(sc420): just check node IDS and sort

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
      graph.connect("sum1", "identity1", "x_i");
    }).toThrow("Input port x_i doesn't allow multiple edges");

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

describe("sequential testing to update f and dfdy", () => {
  const graph = new Graph();

  test("1. should add the nodes successfully", () => {
    const varNode1 = new VariableNode("v1");
    const varNode2 = new VariableNode("v2");
    const constNode1 = new ConstantNode("c1");
    const sumNode1 = buildSumNode("sum1");
    const sumNode2 = buildSumNode("sum2");
    const productNode1 = buildProductNode("product1");
    const identityNode1 = buildIdentityNode("identity1");
    const newNodes = [
      varNode1,
      varNode2,
      constNode1,
      sumNode1,
      sumNode2,
      productNode1,
      identityNode1,
    ];

    // Add the nodes
    newNodes.forEach((newNode) => {
      graph.addNode(newNode);
    });
  });

  test("2. updating operation node values should fail", () => {
    expect(() => {
      graph.setNodeValue("sum1", 5);
    }).toThrow("Operation node should only update f, not set a value");
  });

  test("3. should have f and dfdy after first connection", () => {
    graph.setTargetNode("v1");
    graph.setNodeValue("v1", 2);
    graph.connect("v1", "sum1", "x_i");

    const updatedNodes = graph.update();
    const expectedUpdatedNodes = new Set<string>(["v1", "sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);

    // sum1 = v1
    expect(graph.getNodeValue("v1")).toBeCloseTo(2);
    expect(graph.getNodeValue("sum1")).toBeCloseTo(2);
    // d(v1)/d(v1) = 1
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(1);
    // d(v1)/d(sum1) = 0
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(0);
  });

  test("4. should have correct f and dfdy after changing the target node", () => {
    graph.setTargetNode("sum1");

    const updatedNodes = graph.update();
    const expectedUpdatedNodes = new Set<string>(["v1", "sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);

    // sum1 = v1
    expect(graph.getNodeValue("v1")).toBeCloseTo(2);
    expect(graph.getNodeValue("sum1")).toBeCloseTo(2);
    // d(sum1)/d(v1) = 1
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(1);
    // d(sum1)/d(sum1) = 1
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(1);
  });

  test("5. should have correct f and dfdy in forward-mode differentiation", () => {
    graph.setDifferentiationMode("FORWARD");

    const updatedNodes = graph.update();
    const expectedUpdatedNodes = new Set<string>(["v1", "sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);

    // sum1 = v1
    expect(graph.getNodeValue("v1")).toBeCloseTo(2);
    expect(graph.getNodeValue("sum1")).toBeCloseTo(2);
    // d(v1)/d(sum1) = 0
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(0);
    // d(sum1)/d(sum1) = 1
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(1);
  });

  test("6. should have correct f and dfdy after new connection", () => {
    graph.setDifferentiationMode("REVERSE");
    graph.connect("v2", "sum1", "x_i");
    graph.setNodeValue("v2", 1);

    const updatedNodes = graph.update();
    const expectedUpdatedNodes = new Set<string>(["v1", "v2", "sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);

    // sum1 = v1 + v2
    expect(graph.getNodeValue("v1")).toBeCloseTo(2);
    expect(graph.getNodeValue("v2")).toBeCloseTo(1);
    expect(graph.getNodeValue("sum1")).toBeCloseTo(3);
    // d(sum1)/d(v1) = 1
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(1);
    // d(sum1)/d(v2) = 1
    expect(graph.getNodeDerivative("v2")).toBeCloseTo(1);
    // d(sum1)/d(sum1) = 1
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(1);
  });

  test("7. should have correct f and dfdy after disconnection", () => {
    graph.disconnect("v1", "sum1", "x_i");

    const updatedNodes = graph.update();
    const expectedUpdatedNodes = new Set<string>(["v1", "v2", "sum1"]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);

    // sum1 = v2
    expect(graph.getNodeValue("v1")).toBeCloseTo(2);
    expect(graph.getNodeValue("v2")).toBeCloseTo(1);
    expect(graph.getNodeValue("sum1")).toBeCloseTo(1);
    // d(sum1)/d(v1) = 0
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(0);
    // d(sum2)/d(v2) = 1
    expect(graph.getNodeDerivative("v2")).toBeCloseTo(1);
    // d(sum1)/d(sum1) = 1
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(1);
  });

  test("8. should have correct f and dfdy in reverse mode", () => {
    graph.setDifferentiationMode("REVERSE");

    graph.connect("v1", "sum1", "x_i");
    graph.connect("v2", "sum2", "x_i");
    graph.connect("c1", "sum2", "x_i");
    graph.connect("sum1", "product1", "x_i");
    graph.connect("sum2", "product1", "x_i");
    graph.connect("product1", "identity1", "x");

    graph.setNodeValue("v1", 2);
    graph.setNodeValue("v2", 1);
    graph.setNodeValue("c1", 1);

    graph.setTargetNode("identity1");

    const updatedNodes = graph.update();
    const expectedUpdatedNodes = new Set<string>([
      "v1",
      "v2",
      "c1",
      "sum1",
      "sum2",
      "product1",
      "identity1",
    ]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);

    expect(graph.getNodeValue("v1")).toBeCloseTo(2);
    expect(graph.getNodeValue("v2")).toBeCloseTo(1);
    expect(graph.getNodeValue("c1")).toBeCloseTo(1);
    // sum1 = v1 + v2 = 3
    expect(graph.getNodeValue("sum1")).toBeCloseTo(3);
    // sum2 = v2 + c1 = 2
    expect(graph.getNodeValue("sum2")).toBeCloseTo(2);
    // product1 = sum1 * sum2
    expect(graph.getNodeValue("product1")).toBeCloseTo(6);
    // identity1 = product1
    expect(graph.getNodeValue("identity1")).toBeCloseTo(6);

    // d(identity1)/d(identity1) = 1
    expect(graph.getNodeDerivative("identity1")).toBeCloseTo(1);
    // d(identity1)/d(product1) = 1
    expect(graph.getNodeDerivative("product1")).toBeCloseTo(1);
    // d(identity1)/d(sum1) = sum2 = 2
    expect(graph.getNodeDerivative("sum1")).toBeCloseTo(2);
    // d(identity1)/d(sum2) = sum1 = 3
    expect(graph.getNodeDerivative("sum2")).toBeCloseTo(3);
    // d(identity1)/d(v1) = d(sum1)/d(v1) * d(product1)/d(sum1) = 1 * 2 = 2
    expect(graph.getNodeDerivative("v1")).toBeCloseTo(2);
    // d(identity1)/d(v2) = d(sum1)/d(v2) * d(product1)/d(sum1) +
    // d(sum2)/d(v2) * d(product1)/d(sum2) = 1 * 2 + 1 * 3 = 5
    expect(graph.getNodeDerivative("v2")).toBeCloseTo(5);
    //  d(identity1)/d(c1) = 0 (constant)
    expect(graph.getNodeDerivative("c1")).toBeCloseTo(0);
  });

  test("9. should have correct f and dfdy in forward mode", () => {
    graph.setDifferentiationMode("FORWARD");

    graph.setNodeValue("v1", 2);
    graph.setNodeValue("v2", 1);
    graph.setNodeValue("c1", 1);

    graph.setTargetNode("v2");

    const updatedNodes = graph.update();
    const expectedUpdatedNodes = new Set<string>([
      "v1",
      "v2",
      "c1",
      "sum1",
      "sum2",
      "product1",
      "identity1",
    ]);
    expect(updatedNodes).toEqual(expectedUpdatedNodes);

    expect(graph.getNodeValue("v1")).toBeCloseTo(2);
    expect(graph.getNodeValue("v2")).toBeCloseTo(1);
    expect(graph.getNodeValue("c1")).toBeCloseTo(1);
    // sum1 = v1 + v2 = 3
    expect(graph.getNodeValue("sum1")).toBeCloseTo(3);
    // sum2 = v2 + c1 = 2
    expect(graph.getNodeValue("sum2")).toBeCloseTo(2);
    // product1 = sum1 * sum2
    expect(graph.getNodeValue("product1")).toBeCloseTo(6);
    // identity1 = product1
    expect(graph.getNodeValue("identity1")).toBeCloseTo(6);

    // d(v1)/d(v2) = 0 (not in it's forward path)
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
    // d(product1)/d(v2) = d(sum1)/d(v2) * d(product1)/d(sum1) +
    // d(sum2)/d(v2) * d(product1)/d(sum2) = 1 * sum2 + 1 * sum1 = 5
    expect(graph.getNodeDerivative("product1")).toBeCloseTo(5);
    // d(identity1)/d(v2) = d(product1)/d(v2) * d(identity1)/d(product1) =
    // 5 * 1 = 5
    expect(graph.getNodeDerivative("identity1")).toBeCloseTo(5);
  });

  // TODO(sc420): Add a test to set target node to product1 and check if all nodes before product1 derivative is updated to 0
});

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
