import Operation from "./Operation";
import { type NodeData, type PortToNodesData } from "./PortToNodesData";
import {
  PRODUCT_DFDY_CODE,
  PRODUCT_F_CODE,
  SUM_DFDY_CODE,
  SUM_F_CODE,
} from "./test_utils";

const BROKEN_SUM_F_CODE = `\
function f(portToNodes) {
  let sum = 0;
  portToNodes.x_i.forEach((nodeData) => {
    sum += nodeData.value;
  });
  return sum;
}
`;

const WRONG_RETURN_TYPE_SUM_DFDY_CODE = `\
function dfdy(portToNodes, y) {
  return "abc";
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

describe("evaluating problematic code", () => {
  let operation: Operation;
  const portToNodesData: PortToNodesData = {
    x_i: {
      v1: { id: "v1", value: 1 },
      v3: { id: "v3", value: 3 },
      v2: { id: "v2", value: 2 },
    },
  };

  beforeAll(() => {
    operation = new Operation(
      BROKEN_SUM_F_CODE,
      WRONG_RETURN_TYPE_SUM_DFDY_CODE,
    );
  });

  test("should throw error when eval f", () => {
    const mockConsole = jest.spyOn(console, "error").mockImplementation();

    const topLineMessages = [
      "Error occurred when running eval with the user code: ",
      "portToNodes.x_i.forEach is not a function\n",
      "Please make sure the following code is executable:",
    ].join("");

    expect(() => {
      operation.evalF(portToNodesData);
    }).toThrow(topLineMessages);

    expect(mockConsole).toHaveBeenCalledWith(
      expect.stringContaining(topLineMessages),
    );
    expect(mockConsole).toHaveBeenCalledWith(
      expect.stringContaining("Stack trace:"),
    );

    jest.restoreAllMocks(); // restores the spy created with spyOn
  });

  test("should throw error when eval dfdy", () => {
    const yNodeData: NodeData = { id: "v2", value: 3 };
    expect(() => {
      operation.evalDfdy(portToNodesData, yNodeData);
    }).toThrow("The eval result should be number, but got type string");
  });
});
