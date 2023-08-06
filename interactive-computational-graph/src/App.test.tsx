import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import ResizeObserver from "resize-observer-polyfill";
import App from "./App";

test("renders the app", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("renders title", () => {
  // mocks ResizeObserver
  // Reference: https://github.com/ZeeCoder/use-resize-observer/issues/40#issuecomment-1540994404
  global.ResizeObserver = ResizeObserver;

  render(<App />);
  const linkElement = screen.getByText(/Interactive Computational Graph/i);
  expect(linkElement).toBeInTheDocument();
});
