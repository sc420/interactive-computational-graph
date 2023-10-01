import {
  PRODUCT_DFDX_CODE,
  PRODUCT_F_CODE,
  SUM_DFDX_CODE,
  SUM_F_CODE,
} from "../features/BuiltInCode";
import Operation from "./Operation";

const BROKEN_SUM_F_CODE = `\
function f(fInputPortToNodes, fInputNodeToValues) {
  let sum = 0;
  fInputPortToNodes.x_i.forEach((inputNodeId) => {
    const inputNodeValue = parseNumber(fInputNodeToValues[inputNodeId]);
    sum += inputNodeValue;
  });
  return \`\${sum}\`;
}
`;

const WRONG_RETURN_TYPE_SUM_DFDX_CODE = `\
function dfdx(fInputPortToNodes, fInputNodeToValues, xId) {
  return 0;
}
`;

describe("evaluating sum when there're inputs", () => {
  let operation: Operation;
  const fInputPortToNodes: Record<string, string[]> = {
    x_i: ["v1", "v3", "v2"],
  };
  const fInputNodeToValues: Record<string, string> = {
    v1: "1",
    v3: "3",
    v2: "2",
  };

  beforeAll(() => {
    operation = new Operation(SUM_F_CODE, SUM_DFDX_CODE);
  });

  test("should eval f correctly", () => {
    const f = operation.evalF(fInputPortToNodes, fInputNodeToValues);
    expect(parseFloat(f)).toBeCloseTo(6);
  });

  test("dfdx should be 1 when x is one of its input", () => {
    const xId = "v2";
    const y = operation.evalDfdx(fInputPortToNodes, fInputNodeToValues, xId);
    expect(parseFloat(y)).toBeCloseTo(1);
  });

  test("dfdx should be 0 when x is not one of its input", () => {
    const xId = "v4";
    const y = operation.evalDfdx(fInputPortToNodes, fInputNodeToValues, xId);
    expect(parseFloat(y)).toBeCloseTo(0);
  });
});

describe("evaluating sum when there're no inputs", () => {
  let operation: Operation;
  const fInputPortToNodes: Record<string, string[]> = {
    x_i: [],
  };
  const fInputNodeToValues: Record<string, string> = {};

  beforeAll(() => {
    operation = new Operation(SUM_F_CODE, SUM_DFDX_CODE);
  });

  test("should eval f correctly", () => {
    const y = operation.evalF(fInputPortToNodes, fInputNodeToValues);
    expect(parseFloat(y)).toBeCloseTo(0);
  });

  test("dfdx should be always 0", () => {
    const xId = "v2";
    const y = operation.evalDfdx(fInputPortToNodes, fInputNodeToValues, xId);
    expect(parseFloat(y)).toBeCloseTo(0);
  });
});

describe("evaluating product when there're inputs", () => {
  let operation: Operation;
  const fInputPortToNodes: Record<string, string[]> = {
    x_i: ["v1", "v3", "v2"],
  };
  const fInputNodeToValues: Record<string, string> = {
    v1: "0.5",
    v3: "2",
    v2: "3",
  };

  beforeAll(() => {
    operation = new Operation(PRODUCT_F_CODE, PRODUCT_DFDX_CODE);
  });

  test("should eval f correctly", () => {
    const y = operation.evalF(fInputPortToNodes, fInputNodeToValues);
    expect(parseFloat(y)).toBeCloseTo(3.0);
  });

  test("dfdx should not be 0 when x is one of its input", () => {
    const xId = "v2";
    const y = operation.evalDfdx(fInputPortToNodes, fInputNodeToValues, xId);
    expect(parseFloat(y)).toBeCloseTo(1.0); // 0.5 * 2
  });

  test("dfdx should be 0 when x is not one of its input", () => {
    const xId = "v4";
    const y = operation.evalDfdx(fInputPortToNodes, fInputNodeToValues, xId);
    expect(parseFloat(y)).toBeCloseTo(0);
  });
});

describe("evaluating product when there're no inputs", () => {
  let operation: Operation;
  const fInputPortToNodes: Record<string, string[]> = {
    x_i: [],
  };
  const fInputNodeToValues: Record<string, string> = {};

  beforeAll(() => {
    operation = new Operation(PRODUCT_F_CODE, PRODUCT_DFDX_CODE);
  });

  test("should eval f correctly", () => {
    const y = operation.evalF(fInputPortToNodes, fInputNodeToValues);
    expect(parseFloat(y)).toBeCloseTo(1);
  });

  test("dfdx should be always 0", () => {
    const xId = "v2";
    const y = operation.evalDfdx(fInputPortToNodes, fInputNodeToValues, xId);
    expect(parseFloat(y)).toBeCloseTo(0);
  });
});

describe("evaluating problematic code", () => {
  let operation: Operation;
  const fInputPortToNodes: Record<string, string[]> = {
    x_i: ["v1", "v3", "v2"],
  };
  const fInputNodeToValues: Record<string, string> = {
    v1: "1",
    v3: "3",
    v2: "2",
  };

  beforeAll(() => {
    operation = new Operation(
      BROKEN_SUM_F_CODE,
      WRONG_RETURN_TYPE_SUM_DFDX_CODE,
    );
  });

  test("should throw error when eval f", () => {
    const mockConsole = jest.spyOn(console, "error").mockImplementation();

    const topLineMessages = [
      "Error occurred when running eval with the user code: ",
      "parseNumber is not defined\n",
      "Please make sure the following code is executable:",
    ].join("");

    expect(() => {
      operation.evalF(fInputPortToNodes, fInputNodeToValues);
    }).toThrow(topLineMessages);

    expect(mockConsole).toHaveBeenCalledWith(
      expect.stringContaining(topLineMessages),
    );
    expect(mockConsole).toHaveBeenCalledWith(
      expect.stringContaining("Stack trace:"),
    );

    jest.restoreAllMocks(); // restores the spy created with spyOn
  });

  test("should throw error when eval dfdx", () => {
    const mockConsole = jest.spyOn(console, "error").mockImplementation();

    const xId = "v2";
    expect(() => {
      operation.evalDfdx(fInputPortToNodes, fInputNodeToValues, xId);
    }).toThrow("The eval result should be string, but got type number");

    expect(mockConsole).toHaveBeenCalled();

    jest.restoreAllMocks(); // restores the spy created with spyOn
  });
});
