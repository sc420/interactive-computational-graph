import { render, screen } from "@testing-library/react";
import App from "./App";
import { mockReactFlow } from "./MockReactFlow";

beforeAll(() => {
  mockReactFlow();
});

test("renders title", () => {
  render(<App />);
  const linkElement = screen.getByRole("heading", { level: 1 });
  expect(linkElement).toBeInTheDocument();
});
