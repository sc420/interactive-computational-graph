import Operation from "../core/Operation";
import Port from "../core/Port";
import type NodeNameBuilderState from "../states/NodeNameBuilderState";
import { ADD_DFDX_CODE, ADD_F_CODE } from "./BuiltInCode";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";
import NodeNameBuilder from "./NodeNameBuilder";

test("should build names with interleaving node types", () => {
  const builder = new NodeNameBuilder();

  expect(builder.buildName(getConstantNodeType(), null)).toBe("c_1");
  expect(builder.buildName(getAddNodeType(), getAddOperation())).toBe("a_1");
  expect(builder.buildName(getConstantNodeType(), null)).toBe("c_2");
  expect(builder.buildName(getVariableNodeType(), null)).toBe("v_1");
  expect(builder.buildName(getAddNodeType(), getAddOperation())).toBe("a_2");
  expect(builder.buildName(getConstantNodeType(), null)).toBe("c_3");
  expect(builder.buildName(getVariableNodeType(), null)).toBe("v_2");
  expect(builder.buildName(getAddNodeType(), getAddOperation())).toBe("a_3");
  expect(builder.buildName(getVariableNodeType(), null)).toBe("v_3");
  expect(builder.buildName(getVariableNodeType(), null)).toBe("v_4");
});

test("should have braces around counter when counter is more than 9", () => {
  const builder = new NodeNameBuilder();

  for (let counter = 1; counter < 10; counter += 1) {
    expect(builder.buildName(getConstantNodeType(), null)).toBe(`c_${counter}`);
  }
  expect(builder.buildName(getConstantNodeType(), null)).toBe(`c_{10}`);
  expect(builder.buildName(getConstantNodeType(), null)).toBe(`c_{11}`);
  expect(builder.buildName(getConstantNodeType(), null)).toBe(`c_{12}`);
});

test("should save the state", () => {
  const builder = new NodeNameBuilder();

  builder.buildName(getConstantNodeType(), null);
  builder.buildName(getAddNodeType(), getAddOperation());
  builder.buildName(getVariableNodeType(), null);

  expect(builder.save()).toEqual({
    constantCounter: 2,
    variableCounter: 2,
    operationIdToCounter: {
      add: 2,
    },
  });
});

test("should have correct state after loading", () => {
  const builder = new NodeNameBuilder();
  const state: NodeNameBuilderState = {
    constantCounter: 2,
    variableCounter: 2,
    operationIdToCounter: {
      add: 2,
    },
  };

  builder.load(state);

  expect(builder.buildName(getConstantNodeType(), null)).toBe("c_2");
  expect(builder.buildName(getAddNodeType(), getAddOperation())).toBe("a_2");
  expect(builder.buildName(getVariableNodeType(), null)).toBe("v_2");
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
    type: "basic",
    namePrefix: "a",
    operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
    inputPorts: [new Port("a", false), new Port("b", false)],
    helpText: "Add two numbers $ a + b $",
  };
};
