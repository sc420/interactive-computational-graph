import { render, screen } from "@testing-library/react";
import type OperationNodeData from "../features/OperationNodeData";
import NodeTitle from "./NodeTitle";

jest.mock("../latex/Katex");

test("should render the name", () => {
  const operationData = getOperationData();
  const handleNameChange = jest.fn();
  render(
    <NodeTitle
      id="1"
      name="abc"
      operationData={operationData}
      backgroundColor="white"
      isDarkMode={false}
      isHighlighted={false}
      onNameChange={handleNameChange}
    />,
  );

  expect(screen.getByText("abc")).toBeInTheDocument();
});

test("should not have striped animation when not highlighted", () => {
  const operationData = getOperationData();
  const handleNameChange = jest.fn();
  render(
    <NodeTitle
      id="1"
      name="abc"
      operationData={operationData}
      backgroundColor="white"
      isDarkMode={false}
      isHighlighted={false}
      onNameChange={handleNameChange}
    />,
  );

  const nodeTitle = screen.getByTestId("node-title-1");
  expect(nodeTitle).not.toHaveClass("striped-animation-light");
  expect(nodeTitle).not.toHaveClass("striped-animation-dark");
});

test("should have light striped animation when highlighted in light mode", () => {
  const operationData = getOperationData();
  const handleNameChange = jest.fn();
  render(
    <NodeTitle
      id="1"
      name="abc"
      operationData={operationData}
      backgroundColor="white"
      isDarkMode={false}
      isHighlighted={true}
      onNameChange={handleNameChange}
    />,
  );

  const nodeTitle = screen.getByTestId("node-title-1");
  expect(nodeTitle).toHaveClass("striped-animation-light");
  expect(nodeTitle).not.toHaveClass("striped-animation-dark");
});

test("should have dark striped animation when highlighted in dark mode", () => {
  const operationData = getOperationData();
  const handleNameChange = jest.fn();
  render(
    <NodeTitle
      id="1"
      name="abc"
      operationData={operationData}
      backgroundColor="white"
      isDarkMode={true}
      isHighlighted={true}
      onNameChange={handleNameChange}
    />,
  );

  const nodeTitle = screen.getByTestId("node-title-1");
  expect(nodeTitle).not.toHaveClass("striped-animation-light");
  expect(nodeTitle).toHaveClass("striped-animation-dark");
});

const getOperationData = (): OperationNodeData | null => {
  return {
    text: "Operation 1",
    helpText: "Do something",
  };
};
