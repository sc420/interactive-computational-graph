import { fireEvent, render, screen } from "@testing-library/react";
import { mockReactFlow } from "../ReactFlowMock";
import GraphContainer from "./GraphContainer";

beforeAll(() => {
  mockReactFlow();
});

it("connects two constant nodes to a sum node", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  // Connect from the constant nodes to the sum node
  connectEdge("1", "output", "3", "x_i");
  connectEdge("2", "output", "3", "x_i");
});

const connectEdge = (
  source: string,
  sourceHandle: string,
  target: string,
  targetHandle: string,
): void => {
  const onConnectSource = screen.getByLabelText("onConnect.source");
  fireEvent.change(onConnectSource, { target: { value: source } });
  const onConnectSourceHandle = screen.getByLabelText("onConnect.sourceHandle");
  fireEvent.change(onConnectSourceHandle, { target: { value: sourceHandle } });
  const onConnectTarget = screen.getByLabelText("onConnect.target");
  fireEvent.change(onConnectTarget, { target: { value: target } });
  const onConnectTargetHandle = screen.getByLabelText("onConnect.targetHandle");
  fireEvent.change(onConnectTargetHandle, { target: { value: targetHandle } });
  const triggerOnConnectButton = screen.getByText("Trigger onConnect");
  fireEvent.click(triggerOnConnectButton);
};
