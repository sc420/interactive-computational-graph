import { fireEvent, render, screen } from "@testing-library/react";
import WelcomeDialog from "./WelcomeDialog";

test("should show the dialog automatically", () => {
  const handleLoad = jest.fn();
  render(<WelcomeDialog onLoad={handleLoad} />);

  const loadFromExamplesText = screen.getByText("Load From Examples");
  expect(loadFromExamplesText).toBeInTheDocument();
  const buildYourOwnGraphText = screen.getByText("Build Your Own Graph");
  expect(buildYourOwnGraphText).toBeInTheDocument();
});

test("should trigger onLoad when clicking the example", () => {
  const handleLoad = jest.fn();
  render(<WelcomeDialog onLoad={handleLoad} />);

  const basicArithmetic1ListItem = screen.getByText("f = x + y");
  fireEvent.click(basicArithmetic1ListItem);

  expect(handleLoad).toHaveBeenCalled();
});

test("should not trigger onLoad when clicking blank graph button", () => {
  const handleLoad = jest.fn();
  render(<WelcomeDialog onLoad={handleLoad} />);

  const blankGraphButton = screen.getByText("Blank Graph");
  fireEvent.click(blankGraphButton);

  expect(handleLoad).not.toHaveBeenCalled();
});
