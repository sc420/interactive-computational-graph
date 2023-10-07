import { render, screen } from "@testing-library/react";
import NodeTitle from "./NodeTitle";

jest.mock("../latex/Katex");

test("should render the name", () => {
  const handleNameChange = jest.fn();
  render(
    <NodeTitle
      name="abc"
      backgroundColor="white"
      isDarkMode={false}
      isHighlighted={false}
      onNameChange={handleNameChange}
    />,
  );

  expect(screen.getByText("abc")).toBeInTheDocument();
});

test("should not have striped animation when not highlighted", () => {
  const handleNameChange = jest.fn();
  render(
    <NodeTitle
      name="abc"
      backgroundColor="white"
      isDarkMode={false}
      isHighlighted={false}
      onNameChange={handleNameChange}
    />,
  );

  const nodeTitle = screen.getByTestId("node-title");
  expect(nodeTitle).not.toHaveClass("striped-animation-light");
  expect(nodeTitle).not.toHaveClass("striped-animation-dark");
});

test("should have light striped animation when highlighted in light mode", () => {
  const handleNameChange = jest.fn();
  render(
    <NodeTitle
      name="abc"
      backgroundColor="white"
      isDarkMode={false}
      isHighlighted={true}
      onNameChange={handleNameChange}
    />,
  );

  const nodeTitle = screen.getByTestId("node-title");
  expect(nodeTitle).toHaveClass("striped-animation-light");
  expect(nodeTitle).not.toHaveClass("striped-animation-dark");
});

test("should have dark striped animation when highlighted in dark mode", () => {
  const handleNameChange = jest.fn();
  render(
    <NodeTitle
      name="abc"
      backgroundColor="white"
      isDarkMode={true}
      isHighlighted={true}
      onNameChange={handleNameChange}
    />,
  );

  const nodeTitle = screen.getByTestId("node-title");
  expect(nodeTitle).not.toHaveClass("striped-animation-light");
  expect(nodeTitle).toHaveClass("striped-animation-dark");
});
