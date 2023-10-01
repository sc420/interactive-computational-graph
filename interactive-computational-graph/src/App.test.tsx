import { render, screen } from "@testing-library/react";
import App from "./App";
import { mockReactFlow } from "./ReactFlowMock";

beforeAll(() => {
  mockReactFlow();
});

test("renders title", () => {
  render(<App />);
  const linkElement = screen.getByText(/Interactive Computational Graph/i);
  expect(linkElement).toBeInTheDocument();
});
