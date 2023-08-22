import { fireEvent, render, screen } from "@testing-library/react";
import { mockReactFlow } from "../ReactFlowMock";
import GraphContainer from "./GraphContainer";

beforeAll(() => {
  mockReactFlow();
});

it("connects two constant nodes to a sum node, and removes the sum node", async () => {
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

  // Remove the sum node
  removeEdge(["reactflow__edge-1output-3x_i", "reactflow__edge-2output-3x_i"]);
  removeNode(["3"]);
});

const removeNode = (ids: string[]): void => {
  const onNodesChangeRemoveId = screen.getByRole("textbox", {
    name: "onNodesChange.remove.jsonIds",
  });
  const jsonIds = JSON.stringify(ids);
  fireEvent.change(onNodesChangeRemoveId, { target: { value: jsonIds } });
  const triggerOnNodesChangeRemoveButton = screen.getByRole("button", {
    name: "Trigger onNodesChange: remove",
  });
  fireEvent.click(triggerOnNodesChangeRemoveButton);
};

const removeEdge = (ids: string[]): void => {
  const onEdgesChangeRemoveId = screen.getByRole("textbox", {
    name: "onEdgesChange.remove.jsonIds",
  });
  const jsonIds = JSON.stringify(ids);
  fireEvent.change(onEdgesChangeRemoveId, { target: { value: jsonIds } });
  const triggerOnEdgesChangeRemoveButton = screen.getByRole("button", {
    name: "Trigger onEdgesChange: remove",
  });
  fireEvent.click(triggerOnEdgesChangeRemoveButton);
};

const connectEdge = (
  source: string,
  sourceHandle: string,
  target: string,
  targetHandle: string,
): void => {
  const onConnectSource = screen.getByRole("textbox", {
    name: "onConnect.source",
  });
  fireEvent.change(onConnectSource, { target: { value: source } });
  const onConnectSourceHandle = screen.getByRole("textbox", {
    name: "onConnect.sourceHandle",
  });
  fireEvent.change(onConnectSourceHandle, { target: { value: sourceHandle } });
  const onConnectTarget = screen.getByRole("textbox", {
    name: "onConnect.target",
  });
  fireEvent.change(onConnectTarget, { target: { value: target } });
  const onConnectTargetHandle = screen.getByRole("textbox", {
    name: "onConnect.targetHandle",
  });
  fireEvent.change(onConnectTargetHandle, { target: { value: targetHandle } });
  const triggerOnConnectButton = screen.getByRole("button", {
    name: "Trigger onConnect",
  });
  fireEvent.click(triggerOnConnectButton);
};
