import { render, screen } from "@testing-library/react";
import ExplainDerivativesHint from "./ExplainDerivativesHint";

test("should not render anything when the data is non-empty", () => {
  render(
    <ExplainDerivativesHint
      hasNodes={true}
      hasDerivativeTarget={true}
      hasExplainDerivativeData={true}
    />,
  );

  expect(screen.queryByRole("alert")).toBeNull();
});

test("should display some text when there're no nodes", () => {
  render(
    <ExplainDerivativesHint
      hasNodes={false}
      hasDerivativeTarget={false}
      hasExplainDerivativeData={false}
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
      hasExplainDerivativeData={false}
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
      hasExplainDerivativeData={false}
    />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Select some node(s) to see the explanations",
  );
});
