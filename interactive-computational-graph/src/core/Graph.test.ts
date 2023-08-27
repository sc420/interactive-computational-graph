import {
  IDENTITY_DFDX_CODE,
  IDENTITY_F_CODE,
  PRODUCT_DFDX_CODE,
  PRODUCT_F_CODE,
  RELU_DFDX_CODE,
  RELU_F_CODE,
  SIGMOID_DFDX_CODE,
  SIGMOID_F_CODE,
  SQUARED_ERROR_DFDX_CODE,
  SQUARED_ERROR_F_CODE,
  SUM_DFDX_CODE,
  SUM_F_CODE,
} from "../features/BuiltInCode";
import ConstantNode from "./ConstantNode";
import {
  CycleError,
  InputNodeAlreadyConnectedError,
  InputPortFullError,
} from "./CoreErrors";
import type CoreNode from "./CoreNode";
import Graph from "./Graph";
import Operation from "./Operation";
import OperationNode from "./OperationNode";
import Port from "./Port";
import VariableNode from "./VariableNode";

describe("manipulating connections", () => {
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
    expect(graph.getNodeType("v1")).toEqual("VARIABLE");
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
      emptyGraph.setNodeValue("v1", "1");
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
    }).toThrow("Input node v1 already exists by port x_i");
  });

  test("should throw error when connecting to non-existent port", () => {
    const graph = buildSmallGraph();
    const varNode3 = new VariableNode("v3");
    graph.addNode(varNode3);

    expect(() => {
      graph.connect("v3", "sum1", "x");
    }).toThrow("Input port x doesn't exist");
  });

  test("should indicate if the port is full", () => {
    const graph = buildMediumGraph();
    const varNode4 = new VariableNode("v4");
    graph.addNode(varNode4);

    expect(() => {
      graph.validateConnect("v4", "identity1", "x");
    }).toThrow(InputPortFullError);
  });

  test("should throw error when connecting the same node to same port again", () => {
    const graph = buildMediumGraph();

    const connectVariableToSum = (): void => {
      graph.connect("v1", "sum1", "x_i");
    };
    expect(connectVariableToSum).toThrow(InputNodeAlreadyConnectedError);
    expect(connectVariableToSum).toThrow(
      "Input node v1 already exists by port x_i of node sum1",
    );
  });

  test("should throw error when connecting to single-connection port", () => {
    const graph = buildMediumGraph();
    const varNode4 = new VariableNode("v4");
    graph.addNode(varNode4);

    const connectVariableToIdentity = (): void => {
      graph.connect("v4", "identity1", "x");
    };
    expect(connectVariableToIdentity).toThrow(InputPortFullError);
    expect(connectVariableToIdentity).toThrow(
      "Input port x of node identity1 doesn't allow multiple edges",
    );

    // Should not be half-connected
    const identityNode1 = graph.getOneNode("identity1");
    expect(varNode4.getRelationship().isOutputPortEmpty()).toBe(true);
    expect(
      identityNode1.getRelationship().getInputNodesByPort("x"),
    ).toHaveLength(1);
  });

  test("should indicate if the connection would cause cycle", () => {
    const graph = buildMediumGraph();

    expect(() => {
      graph.validateConnect("identity1", "sum1", "x_i");
    }).toThrow(CycleError);
    expect(() => {
      graph.validateConnect("sum1", "sum1", "x_i");
    }).toThrow(CycleError);

    const varNode3 = new VariableNode("v4");
    graph.addNode(varNode3);
    graph.validateConnect("v4", "sum1", "x_i");
  });

  test("should throw error when the graph will not be DAG", () => {
    const graph = buildMediumGraph();

    const connectIdentityToSum = (): void => {
      graph.connect("identity1", "sum1", "x_i");
    };

    expect(connectIdentityToSum).toThrow(CycleError);
    expect(connectIdentityToSum).toThrow(
      "Connecting node identity1 to node sum1 would cause a cycle",
    );

    const connectSumToSum = (): void => {
      graph.connect("sum1", "sum1", "x_i");
    };

    expect(connectSumToSum).toThrow(CycleError);
    expect(connectSumToSum).toThrow(
      "Connecting node sum1 to node sum1 would cause a cycle",
    );
  });
});

describe("setting node values", () => {
  test("updating non-operation node values should success", () => {
    const graph = buildSmallGraph();

    graph.setNodeValue("v1", "10");
    graph.setNodeValue("v2", "20");

    expect(graph.getNodeValue("v1")).toBe("10");
    expect(graph.getNodeValue("v2")).toBe("20");
  });

  test("updating operation node values should fail", () => {
    const graph = new Graph();
    const sumNode1 = buildSumNode("sum1");
    graph.addNode(sumNode1);

    expect(() => {
      graph.setNodeValue("sum1", "5");
    }).toThrow("Operation node should only update f, not set a value");
  });
});

describe("updating f values", () => {
  test("should update f values for small graph", () => {
    const graph = buildSmallGraph();

    const updatedNodes = graph.updateFValues();
    const expectedUpdatedNodes: string[] = ["v1", "v2", "sum1"];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());
    expect(parseFloat(graph.getNodeValue("sum1"))).toBeCloseTo(3);
  });

  test("should update f values for medium graph", () => {
    const graph = buildMediumGraph();

    const updatedNodes = graph.updateFValues();
    const expectedUpdatedNodes: string[] = [
      "v1",
      "v2",
      "c1",
      "sum1",
      "sum2",
      "v3",
      "product1",
      "identity1",
    ];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());
    expect(parseFloat(graph.getNodeValue("sum1"))).toBeCloseTo(3);
    expect(parseFloat(graph.getNodeValue("sum2"))).toBeCloseTo(2);
    expect(parseFloat(graph.getNodeValue("product1"))).toBeCloseTo(30);
    expect(parseFloat(graph.getNodeValue("identity1"))).toBeCloseTo(30);
  });

  test("should update f values for complex graph", () => {
    const graph = buildComplexGraph();

    const updatedNodes = graph.updateFValues();
    const expectedUpdatedNodes: string[] = [
      "v1",
      "v2",
      "c1",
      "sum1",
      "sum2",
      "v3",
      "product1",
      "product2",
      "identity1",
    ];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());
    expect(parseFloat(graph.getNodeValue("sum1"))).toBeCloseTo(3);
    expect(parseFloat(graph.getNodeValue("sum2"))).toBeCloseTo(2);
    expect(parseFloat(graph.getNodeValue("product1"))).toBeCloseTo(60);
    expect(parseFloat(graph.getNodeValue("product2"))).toBeCloseTo(10);
    expect(parseFloat(graph.getNodeValue("identity1"))).toBeCloseTo(10);
  });

  test("should update f values for neural network graph", () => {
    const graph = buildNeuralNetworkGraph();

    const updatedNodes = graph.updateFValues();
    const expectedUpdatedNodes: string[] = [
      "i_1",
      "i_2",
      "w_h1_1_1",
      "w_h1_1_2",
      "w_h1_2_1",
      "w_h1_2_2",
      "mul_h1_1_1",
      "mul_h1_1_2",
      "mul_h1_2_1",
      "mul_h1_2_2",
      "b_h1_1",
      "b_h1_2",
      "sum_h1_1",
      "sum_h1_2",
      "relu_h1_1",
      "relu_h1_2",
      "w_o_1_1",
      "w_o_1_2",
      "mul_o_1_1",
      "mul_o_1_2",
      "b_o_1",
      "sum_o_1",
      "sigmoid_o_1",
      "y_estimate",
      "y",
      "se",
    ];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());
    expect(parseFloat(graph.getNodeValue("mul_h1_1_1"))).toBeCloseTo(0);
    expect(parseFloat(graph.getNodeValue("mul_h1_1_2"))).toBeCloseTo(-0.2);
    expect(parseFloat(graph.getNodeValue("mul_h1_2_1"))).toBeCloseTo(0);
    expect(parseFloat(graph.getNodeValue("mul_h1_2_2"))).toBeCloseTo(0.2);
    expect(parseFloat(graph.getNodeValue("sum_h1_1"))).toBeCloseTo(-0.5);
    expect(parseFloat(graph.getNodeValue("sum_h1_2"))).toBeCloseTo(0.5);
    expect(parseFloat(graph.getNodeValue("relu_h1_1"))).toBeCloseTo(0);
    expect(parseFloat(graph.getNodeValue("relu_h1_2"))).toBeCloseTo(0.5);
    expect(parseFloat(graph.getNodeValue("mul_o_1_1"))).toBeCloseTo(0);
    expect(parseFloat(graph.getNodeValue("mul_o_1_2"))).toBeCloseTo(0.25);
    expect(parseFloat(graph.getNodeValue("sum_o_1"))).toBeCloseTo(0);
    expect(parseFloat(graph.getNodeValue("sigmoid_o_1"))).toBeCloseTo(0.5);
    expect(parseFloat(graph.getNodeValue("y_estimate"))).toBeCloseTo(0.5);
    expect(parseFloat(graph.getNodeValue("se"))).toBeCloseTo(0.25);
  });
});

describe("updating derivative values", () => {
  test("should clear derivatives when changing mode", () => {
    const graph = buildSmallGraph();
    graph.setDifferentiationMode("REVERSE");
    graph.setTargetNode("sum1");
    graph.updateFValues();
    graph.updateDerivatives();

    graph.setDifferentiationMode("FORWARD");
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(0);
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(0);
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(0);
  });

  test("should clear derivatives when changing target", () => {
    const graph = buildSmallGraph();
    graph.setDifferentiationMode("FORWARD");
    graph.setTargetNode("sum1");
    graph.updateFValues();
    graph.updateDerivatives();

    graph.setTargetNode("v1");
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(0);
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(0);
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(0);
  });

  test("should update derivatives in reverse mode for small graph", () => {
    const graph = buildSmallGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("REVERSE");

    graph.setTargetNode("v1");
    let updatedNodes = graph.updateDerivatives();
    let expectedUpdatedNodes: string[] = ["v1"];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());
    // d(v1)/d(v1) = 1
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(1);
    // d(v1)/d(v2) = 0 (not in the reverse path)
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(0);
    // d(v1)/d(sum1) = 0 (not in the reverse path)
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(0);

    graph.setTargetNode("sum1");
    updatedNodes = graph.updateDerivatives();
    expectedUpdatedNodes = ["v1", "v2", "sum1"];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());
    // d(sum1)/d(v1) = 1
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(1);
    // d(sum1)/d(v2) = 1
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(1);
    // d(sum1)/d(sum1) = 1
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(1);
  });

  test("should update derivatives in forward mode for small graph", () => {
    const graph = buildSmallGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("FORWARD");

    graph.setTargetNode("v1");
    let updatedNodes = graph.updateDerivatives();
    let expectedUpdatedNodes: string[] = ["v1", "sum1"];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());
    // d(v1)/d(v1) = 1
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(1);
    // d(v2)/d(v1) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(0);
    // d(sum1)/d(v1) = 1
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(1);

    graph.setTargetNode("sum1");
    updatedNodes = graph.updateDerivatives();
    expectedUpdatedNodes = ["sum1"];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());
    // d(v1)/d(sum1) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(0);
    // d(v2)/d(sum1) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(0);
    // d(sum1)/d(sum1) = 1
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(1);
  });

  test("should update derivatives in reverse mode for medium graph", () => {
    const graph = buildMediumGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("REVERSE");
    graph.setTargetNode("identity1");

    const updatedNodes = graph.updateDerivatives();
    const expectedUpdatedNodes: string[] = [
      "v1",
      "v2",
      "c1",
      "sum1",
      "sum2",
      "v3",
      "product1",
      "identity1",
    ];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());

    // d(identity1)/d(identity1) = 1
    expect(parseFloat(graph.getNodeDerivative("identity1"))).toBeCloseTo(1);
    // d(identity1)/d(product1) =
    // d(identity1)/d(product1) * d(identity1)/d(identity1) =
    // 1 * 1 = 1
    expect(parseFloat(graph.getNodeDerivative("product1"))).toBeCloseTo(1);
    // d(identity1)/d(sum1) =
    // d(product1)/d(sum1) * d(identity1)/d(product1) =
    // (sum2 * v3) * (1) = 10 * 1 = 10
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(10);
    // d(identity1)/d(sum2) =
    // d(product1)/d(sum2) * d(identity1)/d(product1) =
    // (sum1 * v3) * (1) = 15 * 1 = 15
    expect(parseFloat(graph.getNodeDerivative("sum2"))).toBeCloseTo(15);
    // d(identity1)/d(v3) =
    // d(product1)/d(v3) * d(identity1)/d(product1) =
    // (sum1 * sum2) * (1) = 6 * 1 = 6
    expect(parseFloat(graph.getNodeDerivative("v3"))).toBeCloseTo(6);
    // d(identity1)/d(v1) =
    // d(sum1)/d(v1) * d(identity1)/d(sum1) =
    // 1 * 10 = 10
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(10);
    // d(identity1)/d(v2) =
    // d(sum1)/d(v2) * d(identity1)/d(sum1) +
    // d(sum2)/d(v2) * d(identity1)/d(sum2) =
    // 1 * 10 + 1 * 15 = 25
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(25);
    // d(identity1)/d(c1) = 0 (constant)
    expect(parseFloat(graph.getNodeDerivative("c1"))).toBeCloseTo(0);
  });

  test("should update derivatives in forward mode for medium graph", () => {
    const graph = buildMediumGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("FORWARD");
    graph.setTargetNode("v2");

    const updatedNodes = graph.updateDerivatives();
    const expectedUpdatedNodes: string[] = [
      "v2",
      "sum1",
      "sum2",
      "product1",
      "identity1",
    ];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());

    // d(v1)/d(v2) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(0);
    // d(v2)/d(v2) = 1
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(1);
    // d(c1)/d(v2) = 0 (constant)
    expect(parseFloat(graph.getNodeDerivative("c1"))).toBeCloseTo(0);
    // d(sum1)/d(v2) =
    // d(v1)/d(v2) * d(sum1)/d(v1) + d(v2)/d(v2) * d(sum1)/d(v2) =
    // 0 * 1 + 1 * 1 = 1
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(1);
    // d(sum2)/d(v2) =
    // d(v2)/d(v2) * d(sum2)/d(v2) + d(c1)/d(v2) * d(sum2)/d(c1) =
    // 1 * 1 + 0 * 0 = 1
    expect(parseFloat(graph.getNodeDerivative("sum2"))).toBeCloseTo(1);
    // d(v3)/d(v2) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v3"))).toBeCloseTo(0);
    // d(product1)/d(v2) =
    // d(sum1)/d(v2) * d(product1)/d(sum1) +
    // d(sum2)/d(v2) * d(product1)/d(sum2) +
    // d(v3)/d(v2) * d(product1)/d(v3) =
    // (1) * (sum2 * v3) + (1) * (sum1 * v3) + (0) * (sum1 * sum2) = 25
    expect(parseFloat(graph.getNodeDerivative("product1"))).toBeCloseTo(25);
    // d(identity1)/d(v2) =
    // d(product1)/d(v2) * d(identity1)/d(product1) =
    // 25 * 1 = 25
    expect(parseFloat(graph.getNodeDerivative("identity1"))).toBeCloseTo(25);
  });

  test("should update derivatives in reverse mode for complex graph", () => {
    const graph = buildComplexGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("REVERSE");
    graph.setTargetNode("identity1");

    let updatedNodes = graph.updateDerivatives();
    let expectedUpdatedNodes: string[] = [
      "v2",
      "c1",
      "sum2",
      "v3",
      "product2",
      "identity1",
    ];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());

    // d(identity1)/d(identity1) = 1
    expect(parseFloat(graph.getNodeDerivative("identity1"))).toBeCloseTo(1);
    // d(identity1)/d(product1) = 0 (not in the reverse path)
    expect(parseFloat(graph.getNodeDerivative("product1"))).toBeCloseTo(0);
    // d(identity1)/d(product2) =
    // d(identity1)/d(product2) * d(identity1)/d(identity1) =
    // 1 * 1 = 1
    expect(parseFloat(graph.getNodeDerivative("product2"))).toBeCloseTo(1);
    // d(identity1)/d(sum1) = 0 (not in the reverse path)
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(0);
    // d(identity1)/d(sum2) =
    // d(product1)/d(sum2) * d(identity1)/d(product1) +
    // d(product2)/d(sum2) * d(identity1)/d(product2) =
    // (sum1 * v3) * (0) + (v3) * (1) = 0 + 5 = 5
    expect(parseFloat(graph.getNodeDerivative("sum2"))).toBeCloseTo(5);
    // d(identity1)/d(v3) =
    // d(product1)/d(v3) * d(identity1)/d(product1) +
    // d(product2)/d(v3) * d(identity1)/d(product2) =
    // (sum1 * sum2) * (0) + (sum2) * (1) = 0 + 2 = 2
    expect(parseFloat(graph.getNodeDerivative("v3"))).toBeCloseTo(2);
    // d(identity1)/d(v1) = 0 (not in the reverse path)
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(0);
    // d(identity1)/d(v2) =
    // d(sum1)/d(v2) * d(identity1)/d(sum1) +
    // d(sum2)/d(v2) * d(identity1)/d(sum2) =
    // 1 * 0 + 1 * 5 = 5
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(5);
    //  d(identity1)/d(c1) = 0 (constant)
    expect(parseFloat(graph.getNodeDerivative("c1"))).toBeCloseTo(0);

    graph.setTargetNode("product1");

    updatedNodes = graph.updateDerivatives();
    expectedUpdatedNodes = ["v1", "v2", "c1", "sum1", "sum2", "v3", "product1"];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());

    // d(product1)/d(identity1) = 0 (not in the reverse path)
    expect(parseFloat(graph.getNodeDerivative("identity1"))).toBeCloseTo(0);
    // d(product1)/d(product1) = 1
    expect(parseFloat(graph.getNodeDerivative("product1"))).toBeCloseTo(1);
    // d(product1)/d(product2) = 0 (not in the reverse path)
    expect(parseFloat(graph.getNodeDerivative("product2"))).toBeCloseTo(0);
    // d(product1)/d(sum1) =
    // d(product1)/d(sum1) * d(product1)/d(product1) =
    // (v1 * sum2 * v3) * (1) = 20
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(20);
    // d(product1)/d(sum2) =
    // d(product1)/d(sum2) * d(product1)/d(product1) +
    // d(product2)/d(sum2) * d(product1)/d(product2) =
    // (v1 * sum1 * v3) * (1) + (v3) * (0) = 30 + 0 = 30
    expect(parseFloat(graph.getNodeDerivative("sum2"))).toBeCloseTo(30);
    // d(product1)/d(v3) =
    // d(product1)/d(v3) * d(product1)/d(product1) +
    // d(product2)/d(v3) * d(product1)/d(product2) =
    // (v1 * sum1 * sum2) * (1) + (sum2) * (0) = 12 + 0 = 12
    expect(parseFloat(graph.getNodeDerivative("v3"))).toBeCloseTo(12);
    // d(product1)/d(v1) =
    // d(product1)/d(v1) * d(product1)/d(product1) +
    // d(sum1)/d(v1) * d(product1)/d(sum1) =
    // (sum1 * sum2 * v3) * (1) + (1) * (20) = 30 + 20 = 50
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(50);
    // d(product1)/d(v2) =
    // d(sum1)/d(v2) * d(product1)/d(sum1) +
    // d(sum2)/d(v2) * d(product1)/d(sum2) =
    // 1 * 20 + 1 * 30 = 50
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(50);
    // d(product1)/d(c1) = 0 (constant)
    expect(parseFloat(graph.getNodeDerivative("c1"))).toBeCloseTo(0);
  });

  test("should update derivatives in forward mode for complex graph", () => {
    const graph = buildComplexGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("FORWARD");
    graph.setTargetNode("v1");

    let updatedNodes = graph.updateDerivatives();
    let expectedUpdatedNodes: string[] = ["v1", "sum1", "product1"];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());

    // d(v1)/d(v1) = 1
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(1);
    // d(v2)/d(v1) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(0);
    // d(c1)/d(v1) = 0 (constant)
    expect(parseFloat(graph.getNodeDerivative("c1"))).toBeCloseTo(0);
    // d(sum1)/d(v1) =
    // d(v1)/d(v1) * d(sum1)/d(v1) + d(v2)/d(v1) * d(sum1)/d(v2) =
    // 1 * 1 + 0 * 1 = 1
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(1);
    // d(sum2)/d(v1) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("sum2"))).toBeCloseTo(0);
    // d(v3)/d(v1) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v3"))).toBeCloseTo(0);
    // d(product1)/d(v1) =
    // d(v1)/d(v1) * d(product1)/d(v1) +
    // d(sum1)/d(v1) * d(product1)/d(sum1) +
    // d(sum2)/d(v1) * d(product1)/d(sum2) +
    // d(v3)/d(v1) * d(product1)/d(v3) =
    // (1) * (sum1 * sum2 * v3) +
    // (1) * (v1 * sum2 * v3) +
    // (0) * (v1 * sum1 * v3) +
    // (0) * (v1 * sum1 * sum2) =
    // 30 + 20 + 0 + 0 = 50
    expect(parseFloat(graph.getNodeDerivative("product1"))).toBeCloseTo(50);
    // d(product2)/d(v1) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("product2"))).toBeCloseTo(0);
    // d(identity1)/d(v1) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("identity1"))).toBeCloseTo(0);

    graph.setTargetNode("sum2");

    updatedNodes = graph.updateDerivatives();
    expectedUpdatedNodes = ["sum2", "product1", "product2", "identity1"];
    expect(updatedNodes.sort()).toEqual(expectedUpdatedNodes.sort());

    // d(v1)/d(sum2) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v1"))).toBeCloseTo(0);
    // d(v2)/d(sum2) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v2"))).toBeCloseTo(0);
    // d(c1)/d(sum2) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("c1"))).toBeCloseTo(0);
    // d(sum1)/d(sum2) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("sum1"))).toBeCloseTo(0);
    // d(sum2)/d(sum2) = 1
    expect(parseFloat(graph.getNodeDerivative("sum2"))).toBeCloseTo(1);
    // d(v3)/d(sum2) = 0 (not in the forward path)
    expect(parseFloat(graph.getNodeDerivative("v3"))).toBeCloseTo(0);
    // d(product1)/d(sum2) =
    // d(v1)/d(sum2) * d(product1)/d(v1) +
    // d(sum1)/d(sum2) * d(product1)/d(sum1) +
    // d(sum2)/d(sum2) * d(product1)/d(sum2) +
    // d(v3)/d(sum2) * d(product1)/d(v3) =
    // (0) * (sum1 * sum2 * v3) +
    // (0) * (v1 * sum2 * v3) +
    // (1) * (v1 * sum1 * v3) +
    // (0) * (v1 * sum1 * sum2) =
    // 0 + 0 + 30 + 0 = 30
    expect(parseFloat(graph.getNodeDerivative("product1"))).toBeCloseTo(30);
    // d(product2)/d(sum2) =
    // d(sum2)/d(sum2) * d(product2)/d(sum2) +
    // d(v3)/d(sum2) * d(product2)/d(v3) =
    // (1) * (v3) +
    // (0) * (sum2) =
    // 5 + 0 = 5
    expect(parseFloat(graph.getNodeDerivative("product2"))).toBeCloseTo(5);
    // d(identity1)/d(sum2) =
    // d(product2)/d(sum2) * d(identity1)/d(product2) =
    // 5 * 1 = 5
    expect(parseFloat(graph.getNodeDerivative("identity1"))).toBeCloseTo(5);
  });

  test("should update derivatives in reverse mode for neural network graph", () => {
    const graph = buildNeuralNetworkGraph();
    graph.updateFValues();

    graph.setDifferentiationMode("REVERSE");
    graph.setTargetNode("se");

    const updatedNodes = graph.updateDerivatives();
    expect(updatedNodes).toHaveLength(graph.getNodes().length);

    // d(se)/d(se) = 1
    expect(parseFloat(graph.getNodeDerivative("se"))).toBeCloseTo(1);
    // d(se)/d(y_estimate) =
    // d(se)/d(y_estimate) * d(se)/d(se) =
    // (2 * (y_estimate - y)) * (1) = 1
    expect(parseFloat(graph.getNodeDerivative("y_estimate"))).toBeCloseTo(1);
    // d(se)/d(y) =
    // d(se)/d(y) * d(se)/d(se) =
    // (2 * (y - y_estimate)) * 1 = -1
    expect(parseFloat(graph.getNodeDerivative("y"))).toBeCloseTo(-1);
    // d(se)/d(sigmoid_o_1) =
    // d(y_estimate)/d(sigmoid_o_1) * d(se)/d(y_estimate) =
    // 1 * 1 = 1
    expect(parseFloat(graph.getNodeDerivative("sigmoid_o_1"))).toBeCloseTo(1);
    // d(se)/d(sum_o_1) =
    // d(sigmoid_o_1)/d(sum_o_1) * d(se)/d(sigmoid_o_1) =
    // (sigmoid_o_1 * (1 - sigmoid_o_1)) * (1) = 0.25
    expect(parseFloat(graph.getNodeDerivative("sum_o_1"))).toBeCloseTo(0.25);
    // d(se)/d(mul_o_1_1) =
    // d(sum_o_1)/d(mul_o_1_1) * d(se)/d(sum_o_1) =
    // 1 * 0.25 = 0.25
    expect(parseFloat(graph.getNodeDerivative("mul_o_1_1"))).toBeCloseTo(0.25);
    // d(se)/d(mul_o_1_2) =
    // d(sum_o_1)/d(mul_o_1_2) * d(se)/d(sum_o_1) =
    // 1 * 0.25 = 0.25
    expect(parseFloat(graph.getNodeDerivative("mul_o_1_2"))).toBeCloseTo(0.25);
    // d(se)/d(b_o_1) =
    // d(sum_o_1)/d(b_o_1) * d(se)/d(sum_o_1) =
    // 1 * 0.25 = 0.25
    expect(parseFloat(graph.getNodeDerivative("b_o_1"))).toBeCloseTo(0.25);
    // d(se)/d(relu_h1_1) =
    // d(mul_o_1_1)/d(relu_h1_1) * d(se)/d(mul_o_1_1) =
    // w_o_1_1 * 0.25 = -0.125
    expect(parseFloat(graph.getNodeDerivative("relu_h1_1"))).toBeCloseTo(
      -0.125,
    );
    // d(se)/d(w_o_1_1) =
    // d(mul_o_1_1)/d(w_o_1_1) * d(se)/d(mul_o_1_1) =
    // relu_h1_1 * 0.25 = 0
    expect(parseFloat(graph.getNodeDerivative("w_o_1_1"))).toBeCloseTo(0);
    // d(se)/d(relu_h1_2) =
    // d(mul_o_1_1)/d(relu_h1_2) * d(se)/d(mul_o_1_1) =
    // w_o_1_2 * 0.25 = 0.125
    expect(parseFloat(graph.getNodeDerivative("relu_h1_2"))).toBeCloseTo(0.125);
    // d(se)/d(w_o_1_2) =
    // d(mul_o_1_1)/d(w_o_1_2) * d(se)/d(mul_o_1_1) =
    // relu_h1_2 * 0.25 = 0.125
    expect(parseFloat(graph.getNodeDerivative("w_o_1_2"))).toBeCloseTo(0.125);
    // d(se)/d(sum_h1_1) =
    // d(relu_h1_1)/d(sum_h1_1) * d(se)/d(relu_h1_1) =
    // 0 * -0.125 = 0
    expect(parseFloat(graph.getNodeDerivative("sum_h1_1"))).toBeCloseTo(0);
    // d(se)/d(sum_h1_2) =
    // d(relu_h1_2)/d(sum_h1_2) * d(se)/d(relu_h1_2) =
    // 1 * 0.125 = 0.125
    expect(parseFloat(graph.getNodeDerivative("sum_h1_2"))).toBeCloseTo(0.125);
  });
});

function buildSmallGraph(): Graph {
  const graph = new Graph();

  // Layer 1
  const varNode1 = new VariableNode("v1");
  const varNode2 = new VariableNode("v2");
  // Layer 2
  const sumNode1 = buildSumNode("sum1");

  // Add the nodes
  const newNodes: CoreNode[] = [varNode1, varNode2, sumNode1];
  newNodes.forEach((newNode) => {
    graph.addNode(newNode);
  });

  // Layer 1 connections
  graph.connect(varNode1.getId(), sumNode1.getId(), "x_i");
  graph.connect(varNode2.getId(), sumNode1.getId(), "x_i");
  // Layer 1 initial values
  graph.setNodeValue(varNode1.getId(), "2");
  graph.setNodeValue(varNode2.getId(), "1");

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
  const varNode3 = new VariableNode("v3");
  // Layer 3
  const productNode1 = buildProductNode("product1");
  // Layer 4
  const identityNode1 = buildIdentityNode("identity1");

  // Add the nodes
  const newNodes: CoreNode[] = [
    varNode1,
    varNode2,
    constNode1,
    sumNode1,
    sumNode2,
    varNode3,
    productNode1,
    identityNode1,
  ];
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
  graph.setNodeValue(varNode1.getId(), "2");
  graph.setNodeValue(varNode2.getId(), "1");
  graph.setNodeValue(constNode1.getId(), "1");
  // Layer 2 initial values
  graph.setNodeValue(varNode3.getId(), "5");

  return graph;
}

function buildComplexGraph(): Graph {
  const graph = new Graph();

  // Layer 1
  const varNode1 = new VariableNode("v1");
  const varNode2 = new VariableNode("v2");
  const constNode1 = new ConstantNode("c1");
  // Layer 2
  const sumNode1 = buildSumNode("sum1");
  const sumNode2 = buildSumNode("sum2");
  const varNode3 = new VariableNode("v3");
  // Layer 3
  const productNode1 = buildProductNode("product1");
  const productNode2 = buildProductNode("product2");
  // Layer 4
  const identityNode1 = buildIdentityNode("identity1");

  // Add the nodes
  const newNodes: CoreNode[] = [
    varNode1,
    varNode2,
    constNode1,
    sumNode1,
    sumNode2,
    varNode3,
    productNode1,
    productNode2,
    identityNode1,
  ];
  newNodes.forEach((newNode) => {
    graph.addNode(newNode);
  });

  // Layer 1 connections
  graph.connect(varNode1.getId(), productNode1.getId(), "x_i");
  graph.connect(varNode1.getId(), sumNode1.getId(), "x_i");
  graph.connect(varNode2.getId(), sumNode1.getId(), "x_i");
  graph.connect(varNode2.getId(), sumNode2.getId(), "x_i");
  graph.connect(constNode1.getId(), sumNode2.getId(), "x_i");
  // Layer 2 connections
  graph.connect(sumNode1.getId(), productNode1.getId(), "x_i");
  graph.connect(sumNode2.getId(), productNode1.getId(), "x_i");
  graph.connect(sumNode2.getId(), productNode2.getId(), "x_i");
  graph.connect(varNode3.getId(), productNode1.getId(), "x_i");
  graph.connect(varNode3.getId(), productNode2.getId(), "x_i");
  // Layer 3 connections
  graph.connect(productNode2.getId(), identityNode1.getId(), "x");

  // Layer 1 initial values
  graph.setNodeValue(varNode1.getId(), "2");
  graph.setNodeValue(varNode2.getId(), "1");
  graph.setNodeValue(constNode1.getId(), "1");
  // Layer 2 initial values
  graph.setNodeValue(varNode3.getId(), "5");

  return graph;
}

/* eslint-disable @typescript-eslint/naming-convention */
function buildNeuralNetworkGraph(): Graph {
  const graph = new Graph();

  // Input layer
  const i_1 = new VariableNode("i_1");
  const i_2 = new VariableNode("i_2");
  // Hidden layer 1: Weights
  const w_h1_1_1 = new VariableNode("w_h1_1_1");
  const w_h1_1_2 = new VariableNode("w_h1_1_2");
  const w_h1_2_1 = new VariableNode("w_h1_2_1");
  const w_h1_2_2 = new VariableNode("w_h1_2_2");
  // Hidden layer 1: Multiplication
  const mul_h1_1_1 = buildProductNode("mul_h1_1_1");
  const mul_h1_1_2 = buildProductNode("mul_h1_1_2");
  const mul_h1_2_1 = buildProductNode("mul_h1_2_1");
  const mul_h1_2_2 = buildProductNode("mul_h1_2_2");
  // Hidden layer 1: Biases
  const b_h1_1 = new VariableNode("b_h1_1");
  const b_h1_2 = new VariableNode("b_h1_2");
  // Hidden layer 1: Sum
  const sum_h1_1 = buildSumNode("sum_h1_1");
  const sum_h1_2 = buildSumNode("sum_h1_2");
  // Hidden layer 1: Activation
  const relu_h1_1 = buildReluNode("relu_h1_1");
  const relu_h1_2 = buildReluNode("relu_h1_2");
  // Output layer: Weights
  const w_o_1_1 = new VariableNode("w_o_1_1");
  const w_o_1_2 = new VariableNode("w_o_1_2");
  // Output layer: Multiplication
  const mul_o_1_1 = buildProductNode("mul_o_1_1");
  const mul_o_1_2 = buildProductNode("mul_o_1_2");
  // Output layer: Biases
  const b_o_1 = new VariableNode("b_o_1");
  // Output layer: Sum
  const sum_o_1 = buildSumNode("sum_o_1");
  // Output layer: Activation
  const sigmoid_o_1 = buildSigmoidNode("sigmoid_o_1");
  // Loss function input: Estimate y
  const y_estimate = buildIdentityNode("y_estimate");
  // Loss function input: True y
  const y = new VariableNode("y");
  // Loss function
  const se = buildSquaredErrorNode("se");

  // Add the nodes
  const newNodes: CoreNode[] = [
    i_1,
    i_2,
    w_h1_1_1,
    w_h1_1_2,
    w_h1_2_1,
    w_h1_2_2,
    mul_h1_1_1,
    mul_h1_1_2,
    mul_h1_2_1,
    mul_h1_2_2,
    b_h1_1,
    b_h1_2,
    sum_h1_1,
    sum_h1_2,
    relu_h1_1,
    relu_h1_2,
    w_o_1_1,
    w_o_1_2,
    mul_o_1_1,
    mul_o_1_2,
    b_o_1,
    sum_o_1,
    sigmoid_o_1,
    y_estimate,
    y,
    se,
  ];
  newNodes.forEach((newNode) => {
    graph.addNode(newNode);
  });

  // Input layer --> Hidden layer 1: Multiplication
  graph.connect(i_1.getId(), mul_h1_1_1.getId(), "x_i");
  graph.connect(i_2.getId(), mul_h1_1_2.getId(), "x_i");
  graph.connect(i_1.getId(), mul_h1_2_1.getId(), "x_i");
  graph.connect(i_2.getId(), mul_h1_2_2.getId(), "x_i");
  // Hidden layer 1: Weights --> Hidden layer 1: Multiplication
  graph.connect(w_h1_1_1.getId(), mul_h1_1_1.getId(), "x_i");
  graph.connect(w_h1_1_2.getId(), mul_h1_1_2.getId(), "x_i");
  graph.connect(w_h1_2_1.getId(), mul_h1_2_1.getId(), "x_i");
  graph.connect(w_h1_2_2.getId(), mul_h1_2_2.getId(), "x_i");
  // Hidden layer 1: Multiplication --> Hidden layer 1: Sum
  graph.connect(mul_h1_1_1.getId(), sum_h1_1.getId(), "x_i");
  graph.connect(mul_h1_1_2.getId(), sum_h1_1.getId(), "x_i");
  graph.connect(mul_h1_2_1.getId(), sum_h1_2.getId(), "x_i");
  graph.connect(mul_h1_2_2.getId(), sum_h1_2.getId(), "x_i");
  // Hidden layer 1: Biases --> Hidden layer 1: Sum
  graph.connect(b_h1_1.getId(), sum_h1_1.getId(), "x_i");
  graph.connect(b_h1_2.getId(), sum_h1_2.getId(), "x_i");
  // Hidden layer 1: Sum --> Hidden layer 1: Activation
  graph.connect(sum_h1_1.getId(), relu_h1_1.getId(), "x");
  graph.connect(sum_h1_2.getId(), relu_h1_2.getId(), "x");
  // Hidden layer 1: Activation --> Output layer: Multiplication
  graph.connect(relu_h1_1.getId(), mul_o_1_1.getId(), "x_i");
  graph.connect(relu_h1_2.getId(), mul_o_1_2.getId(), "x_i");
  // Output layer: Weights --> Output layer: Multiplication
  graph.connect(w_o_1_1.getId(), mul_o_1_1.getId(), "x_i");
  graph.connect(w_o_1_2.getId(), mul_o_1_2.getId(), "x_i");
  // Output layer: Multiplication --> Output layer: Sum
  graph.connect(mul_o_1_1.getId(), sum_o_1.getId(), "x_i");
  graph.connect(mul_o_1_2.getId(), sum_o_1.getId(), "x_i");
  // Output layer: Biases --> Output layer: Sum
  graph.connect(b_o_1.getId(), sum_o_1.getId(), "x_i");
  // Output layer: Sum --> Output layer: Activation
  graph.connect(sum_o_1.getId(), sigmoid_o_1.getId(), "x");
  // Output layer: Activation --> Loss function input: Estimate y
  graph.connect(sigmoid_o_1.getId(), y_estimate.getId(), "x");
  // Loss function input: Estimate y --> Loss function
  graph.connect(y_estimate.getId(), se.getId(), "y_estimate");
  // Loss function input: True y --> Loss function
  graph.connect(y.getId(), se.getId(), "y_true");

  // Input layer values
  graph.setNodeValue(i_1.getId(), "0.0");
  graph.setNodeValue(i_2.getId(), "1.0");
  // Hidden layer 1: Weights random values
  graph.setNodeValue(w_h1_1_1.getId(), "-0.1");
  graph.setNodeValue(w_h1_1_2.getId(), "-0.2");
  graph.setNodeValue(w_h1_2_1.getId(), "0.1");
  graph.setNodeValue(w_h1_2_2.getId(), "0.2");
  // Hidden layer 1: Biases random values
  graph.setNodeValue(b_h1_1.getId(), "-0.3");
  graph.setNodeValue(b_h1_2.getId(), "0.3");
  // Output layer: Weights random values
  graph.setNodeValue(w_o_1_1.getId(), "-0.5");
  graph.setNodeValue(w_o_1_2.getId(), "0.5");
  // Output layer: Biases random values
  graph.setNodeValue(b_o_1.getId(), "-0.25");
  // Loss function input: True y value
  graph.setNodeValue(y.getId(), "0.0");

  return graph;
}
/* eslint-enable @typescript-eslint/naming-convention */

function buildSumNode(id: string): CoreNode {
  const ports: Port[] = [new Port("x_i", true)];
  const operation = new Operation(SUM_F_CODE, SUM_DFDX_CODE);
  return new OperationNode(id, ports, operation);
}

function buildProductNode(id: string): CoreNode {
  const ports: Port[] = [new Port("x_i", true)];
  const operation = new Operation(PRODUCT_F_CODE, PRODUCT_DFDX_CODE);
  return new OperationNode(id, ports, operation);
}

function buildIdentityNode(id: string): CoreNode {
  const ports: Port[] = [new Port("x", false)];
  const operation = new Operation(IDENTITY_F_CODE, IDENTITY_DFDX_CODE);
  return new OperationNode(id, ports, operation);
}

function buildReluNode(id: string): CoreNode {
  const ports: Port[] = [new Port("x", false)];
  const operation = new Operation(RELU_F_CODE, RELU_DFDX_CODE);
  return new OperationNode(id, ports, operation);
}

function buildSigmoidNode(id: string): CoreNode {
  const ports: Port[] = [new Port("x", false)];
  const operation = new Operation(SIGMOID_F_CODE, SIGMOID_DFDX_CODE);
  return new OperationNode(id, ports, operation);
}

function buildSquaredErrorNode(id: string): CoreNode {
  const ports: Port[] = [
    new Port("y_estimate", false),
    new Port("y_true", false),
  ];
  const operation = new Operation(
    SQUARED_ERROR_F_CODE,
    SQUARED_ERROR_DFDX_CODE,
  );
  return new OperationNode(id, ports, operation);
}
