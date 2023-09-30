import type ChainRuleTerm from "../core/ChainRuleTerm";
import { buildExplainDerivativeItems } from "./ExplainDerivativeController";

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
  const items = buildExplainDerivativeItems(
    "someValueBecauseChainRule",
    "v1",
    "14",
    "REVERSE",
    "f",
    chainRuleTerms,
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
  const items = buildExplainDerivativeItems(
    "someValueBecauseChainRule",
    "v1",
    "14",
    "FORWARD",
    "f",
    chainRuleTerms,
  );

  expect(items).toMatchSnapshot();
});

test("should build items when f equals x", () => {
  const chainRuleTerms: ChainRuleTerm[] = [];
  const items = buildExplainDerivativeItems(
    "oneBecauseFEqualsX",
    "x",
    "1",
    "FORWARD",
    "x",
    chainRuleTerms,
  );

  expect(items).toMatchSnapshot();
});

test("should build items when f doesn't depend on x", () => {
  const chainRuleTerms: ChainRuleTerm[] = [];
  const items = buildExplainDerivativeItems(
    "zeroBecauseFNotDependsOnX",
    "x",
    "0",
    "FORWARD",
    "f",
    chainRuleTerms,
  );

  expect(items).toMatchSnapshot();
});

test("should build items when c is a constant", () => {
  const chainRuleTerms: ChainRuleTerm[] = [];
  const items = buildExplainDerivativeItems(
    "zeroBecauseXIsConstant",
    "c",
    "0",
    "FORWARD",
    "f",
    chainRuleTerms,
  );

  expect(items).toMatchSnapshot();
});
