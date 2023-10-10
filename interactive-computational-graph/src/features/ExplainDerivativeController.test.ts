import type ChainRuleTerm from "../core/ChainRuleTerm";
import { buildExplainDerivativeItems } from "./ExplainDerivativeController";
import type ExplainDerivativeBuildOptions from "./ExplainDerivativeBuildOptions";

test("should build chain rule items of reverse mode", () => {
  const chainRuleTerms: ChainRuleTerm[] = [
    {
      neighborNodeId: "op1",
      derivativeRegardingTarget: "2",
      derivativeRegardingCurrent: "1",
    },
    {
      neighborNodeId: "op2",
      derivativeRegardingTarget: "4",
      derivativeRegardingCurrent: "3",
    },
  ];
  const nodeIdToNames = new Map<string, string>([
    ["v1", "v_1"],
    ["op1", "op_1"],
    ["op2", "op_2"],
    ["f", "f"],
  ]);
  const options: ExplainDerivativeBuildOptions = {
    differentiationMode: "REVERSE",
    targetNodeId: "f",
    nodeId: "v1",
    nodeDerivative: "14",
    chainRuleTerms,
    nodeIdToNames,
  };
  const items = buildExplainDerivativeItems(
    "someValueBecauseChainRule",
    options,
  );

  expect(items).toMatchSnapshot();
});

test("should build chain rule items of forward mode", () => {
  const chainRuleTerms: ChainRuleTerm[] = [
    {
      neighborNodeId: "op1",
      derivativeRegardingTarget: "1",
      derivativeRegardingCurrent: "2",
    },
    {
      neighborNodeId: "op2",
      derivativeRegardingTarget: "3",
      derivativeRegardingCurrent: "4",
    },
  ];
  const nodeIdToNames = new Map<string, string>([
    ["v1", "v_1"],
    ["op1", "op_1"],
    ["op2", "op_2"],
    ["f", "f"],
  ]);
  const options: ExplainDerivativeBuildOptions = {
    differentiationMode: "FORWARD",
    targetNodeId: "f",
    nodeId: "v1",
    nodeDerivative: "14",
    chainRuleTerms,
    nodeIdToNames,
  };
  const items = buildExplainDerivativeItems(
    "someValueBecauseChainRule",
    options,
  );

  expect(items).toMatchSnapshot();
});

test("should build items when f equals x", () => {
  const chainRuleTerms: ChainRuleTerm[] = [];
  const nodeIdToNames = new Map<string, string>([["x", "x"]]);
  const options: ExplainDerivativeBuildOptions = {
    differentiationMode: "FORWARD",
    targetNodeId: "x",
    nodeId: "x",
    nodeDerivative: "1",
    chainRuleTerms,
    nodeIdToNames,
  };
  const items = buildExplainDerivativeItems("oneBecauseFEqualsX", options);

  expect(items).toMatchSnapshot();
});

test("should build items when f doesn't depend on x", () => {
  const chainRuleTerms: ChainRuleTerm[] = [];
  const nodeIdToNames = new Map<string, string>([
    ["x", "x"],
    ["f", "f"],
  ]);
  const options: ExplainDerivativeBuildOptions = {
    differentiationMode: "FORWARD",
    targetNodeId: "f",
    nodeId: "x",
    nodeDerivative: "0",
    chainRuleTerms,
    nodeIdToNames,
  };
  const items = buildExplainDerivativeItems(
    "zeroBecauseFNotDependsOnX",
    options,
  );

  expect(items).toMatchSnapshot();
});

test("should build items when c is a constant", () => {
  const chainRuleTerms: ChainRuleTerm[] = [];
  const nodeIdToNames = new Map<string, string>([
    ["c", "c"],
    ["f", "f"],
  ]);
  const options: ExplainDerivativeBuildOptions = {
    differentiationMode: "FORWARD",
    targetNodeId: "f",
    nodeId: "c",
    nodeDerivative: "0",
    chainRuleTerms,
    nodeIdToNames,
  };
  const items = buildExplainDerivativeItems("zeroBecauseXIsConstant", options);

  expect(items).toMatchSnapshot();
});
