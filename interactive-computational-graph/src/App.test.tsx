import { render, screen } from "@testing-library/react";
import App from "./App";
import { mockReactFlow } from "./ReactFlowMock";
// import renderer from "react-test-renderer";

// TODO(sc420): Uncomment when UI becomes stable
// test("renders the app", () => {
//   const tree = renderer.create(<App />).toJSON();
//   expect(tree).toMatchSnapshot();
// });

beforeAll(() => {
  mockReactFlow();
});

test("renders title", () => {
  render(<App />);
  const linkElement = screen.getByText(/Interactive Computational Graph/i);
  expect(linkElement).toBeInTheDocument();
});
