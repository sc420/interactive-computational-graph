import { render, screen } from "@testing-library/react";
import TutorialPanel from "./TutorialPanel";

test("should render the keyboard shortcuts", () => {
  render(<TutorialPanel />);

  expect(screen.getByText("Move nodes")).toBeInTheDocument();
  expect(screen.getByText("Click header + Drag")).toBeInTheDocument();

  expect(screen.getByText("Remove connection")).toBeInTheDocument();
  expect(screen.getByText("Ctrl + Click connection")).toBeInTheDocument();

  expect(screen.getByText("Zoom in/out")).toBeInTheDocument();
  expect(screen.getByText("Mouse wheel")).toBeInTheDocument();
});
