import Operation from "../core/Operation";
import Port from "../core/Port";
import { ADD_DFDX_CODE, ADD_F_CODE } from "./BuiltInCode";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";
import NodeNameBuilder from "./NodeNameBuilder";

test("should build names with interleaving node types", () => {
  const builder = new NodeNameBuilder();

  expect(builder.buildName(getConstantNodeType(), null)).toBe("c_1");
  expect(builder.buildName(getAddNodeType(), getAddOperation())).toBe("add_1");
  expect(builder.buildName(getConstantNodeType(), null)).toBe("c_2");
  expect(builder.buildName(getVariableNodeType(), null)).toBe("v_1");
  expect(builder.buildName(getAddNodeType(), getAddOperation())).toBe("add_2");
  expect(builder.buildName(getConstantNodeType(), null)).toBe("c_3");
  expect(builder.buildName(getVariableNodeType(), null)).toBe("v_2");
  expect(builder.buildName(getAddNodeType(), getAddOperation())).toBe("add_3");
  expect(builder.buildName(getVariableNodeType(), null)).toBe("v_3");
  expect(builder.buildName(getVariableNodeType(), null)).toBe("v_4");
});

const getConstantNodeType = (): FeatureNodeType => {
  return {
    nodeType: "CONSTANT",
  };
};

const getVariableNodeType = (): FeatureNodeType => {
  return {
    nodeType: "VARIABLE",
  };
};

const getAddNodeType = (): FeatureNodeType => {
  return {
    nodeType: "OPERATION",
    operationId: "add",
  };
};

const getAddOperation = (): FeatureOperation => {
  return {
    id: "add",
    text: "Add",
    type: "SIMPLE",
    operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
    inputPorts: [new Port("a", false), new Port("b", false)],
    helpText: "Add two numbers $ a + b $",
  };
};
