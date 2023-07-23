import Operation from "./Operation";
import { type NodeData, type PortToNodesData } from "./PortToNodesData";

const SUM_F_CODE = `
/**
 * Calculates f(...).
 * @param {PortToNodesData} portToNodes Object with port ID as the keys and node
 * data as the values. Example data for sum:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 1 },
 *     "v3": { "id": "v3", "value": 3 },
 *     "v2": { "id": "v2", "value": 2 },
 *   }
 * }
 * @return {number} Evaluated f value. For example: 6 given the above example
 * data because f({v1, v3, v2}) = v1.value + v3.value + v2.value.
 */
function f(portToNodes) {
  let sum = 0;
  Object.values(portToNodes.x_i).forEach((nodeData) => {
    sum += nodeData.value;
  });
  return sum;
}
`;

const SUM_DFDY_CODE = `
/**
 * Calculates df/dy.
 * @param portToNodes Object with port ID as the keys and node
 * data as the values. Example data for product:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 0.5 },
 *     "v3": { "id": "v3", "value": 2 },
 *     "v2": { "id": "v2", "value": 3 },
 *   }
 * }
 * @param y Node data of y. Example data for product:
 * { "id": "v2", "value": 3 }
 * @returns Evaluated derivative df/dy. For example, 1.0 given the above example
 * data because df/dy = v1.value * v3.value.
 */
function dfdy(portToNodes, y) {
  if (!(y.id in portToNodes.x_i)) {
    return 0;
  }
  return 1;
}
`;

const PRODUCT_F_CODE = `
/**
 * Calculates f(...).
 * @param {PortToNodesData} portToNodes Object with port ID as the keys and node
 * data as the values. Example data for sum:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 1 },
 *     "v3": { "id": "v3", "value": 3 },
 *     "v2": { "id": "v2", "value": 2 },
 *   }
 * }
 * @return {number} Evaluated f value. For example: 6 given the above example
 * data because f({v1, v3, v2}) = v1.value + v3.value + v2.value.
 */
function f(portToNodes) {
  let product = 1;
  Object.values(portToNodes.x_i).forEach((nodeData) => {
    product *= nodeData.value;
  });
  return product;
}
`;

const PRODUCT_DFDY_CODE = `
/**
 * Calculates df/dy.
 * @param portToNodes Object with port ID as the keys and node
 * data as the values. Example data for product:
 * {
 *   "x_i": {
 *     "v1": { "id": "v1", "value": 0.5 },
 *     "v3": { "id": "v3", "value": 2 },
 *     "v2": { "id": "v2", "value": 3 },
 *   }
 * }
 * @param y Node data of y. Example data for product:
 * { "id": "v2", "value": 3 }
 * @returns Evaluated derivative df/dy. For example, 1.0 given the above example
 * data because df/dy = v1.value * v3.value.
 */
function dfdy(portToNodes, y) {
  if (!(y.id in portToNodes.x_i)) {
    return 0;
  }

  let df = 1;
  Object.values(portToNodes.x_i).forEach((nodeData) => {
    if (nodeData.id !== y.id) {
      df *= nodeData.value;
    }
  });
  return df;
}
`;

describe("evaluating sum when there're inputs", () => {
  let operation: Operation;
  const portToNodesData: PortToNodesData = {
    x_i: {
      v1: { id: "v1", value: 1 },
      v3: { id: "v3", value: 3 },
      v2: { id: "v2", value: 2 },
    },
  };

  beforeAll(() => {
    operation = new Operation(SUM_F_CODE, SUM_DFDY_CODE);
  });

  test("should eval f correctly", () => {
    const f = operation.evalF(portToNodesData);
    expect(f).toBe(6);
  });

  test("dfdy should be 1 when y is one of its input", () => {
    const yNodeData: NodeData = { id: "v2", value: 2 };
    const f = operation.evalDfdy(portToNodesData, yNodeData);
    expect(f).toBe(1);
  });

  test("dfdy should be 0 when y is not one of its input", () => {
    const yNodeData: NodeData = { id: "v4", value: 4 };
    const f = operation.evalDfdy(portToNodesData, yNodeData);
    expect(f).toBe(0);
  });
});

describe("evaluating sum when there're no inputs", () => {
  let operation: Operation;
  const portToNodesData: PortToNodesData = {
    x_i: {},
  };

  beforeAll(() => {
    operation = new Operation(SUM_F_CODE, SUM_DFDY_CODE);
  });

  test("should eval f correctly", () => {
    const f = operation.evalF(portToNodesData);
    expect(f).toBe(0);
  });

  test("dfdy should be always 0", () => {
    const yNodeData: NodeData = { id: "v2", value: 2 };
    const f = operation.evalDfdy(portToNodesData, yNodeData);
    expect(f).toBe(0);
  });
});

describe("evaluating product when there're inputs", () => {
  let operation: Operation;
  const portToNodesData: PortToNodesData = {
    x_i: {
      v1: { id: "v1", value: 0.5 },
      v3: { id: "v3", value: 2 },
      v2: { id: "v2", value: 3 },
    },
  };

  beforeAll(() => {
    operation = new Operation(PRODUCT_F_CODE, PRODUCT_DFDY_CODE);
  });

  test("should eval f correctly", () => {
    const f = operation.evalF(portToNodesData);
    expect(f).toBeCloseTo(3.0);
  });

  test("dfdy should not be 0 when y is one of its input", () => {
    const yNodeData: NodeData = { id: "v2", value: 3 };
    const f = operation.evalDfdy(portToNodesData, yNodeData);
    expect(f).toBeCloseTo(1.0); // 0.5 * 2
  });

  test("dfdy should be 0 when y is not one of its input", () => {
    const yNodeData: NodeData = { id: "v4", value: 3.14 };
    const f = operation.evalDfdy(portToNodesData, yNodeData);
    expect(f).toBe(0);
  });
});

describe("evaluating product when there're no inputs", () => {
  let operation: Operation;
  const portToNodesData: PortToNodesData = {
    x_i: {},
  };

  beforeAll(() => {
    operation = new Operation(PRODUCT_F_CODE, PRODUCT_DFDY_CODE);
  });

  test("should eval f correctly", () => {
    const f = operation.evalF(portToNodesData);
    expect(f).toBe(1);
  });

  test("dfdy should be always 0", () => {
    const yNodeData: NodeData = { id: "v2", value: 2 };
    const f = operation.evalDfdy(portToNodesData, yNodeData);
    expect(f).toBe(0);
  });
});
