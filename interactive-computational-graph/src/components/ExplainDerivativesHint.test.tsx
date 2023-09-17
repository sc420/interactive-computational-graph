import { render, screen } from "@testing-library/react";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import ExplainDerivativesHint from "./ExplainDerivativesHint";

test("should not render anything when the data is non-empty", () => {
  const explainDerivativeData: ExplainDerivativeData[] = [
    {
      nodeId: "v1",
      items: [],
    },
  ];
  render(
    <ExplainDerivativesHint
      hasNodes={true}
      hasDerivativeTarget={true}
      explainDerivativeData={explainDerivativeData}
    />,
  );

  expect(screen.queryByRole("alert")).toBeNull();
});

test("should display some text when there're no nodes", () => {
  render(
    <ExplainDerivativesHint
      hasNodes={false}
      hasDerivativeTarget={false}
      explainDerivativeData={[]}
    />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Add some node(s) and select them to see the explanations",
  );
});

test("should display some text when the derivative target is not set", () => {
  render(
    <ExplainDerivativesHint
      hasNodes={true}
      hasDerivativeTarget={false}
      explainDerivativeData={[]}
    />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Set the derivative target to see the explanations",
  );
});

test("should display some text when there're no selected nodes", () => {
  render(
    <ExplainDerivativesHint
      hasNodes={true}
      hasDerivativeTarget={true}
      explainDerivativeData={[]}
    />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Select some node(s) to see the explanations",
  );
});
