import { fireEvent, render, screen } from "@testing-library/react";
import { mockReactFlow } from "../ReactFlowMock";
import type FeatureNodeType from "../features/FeatureNodeType";
import GraphContainer from "./GraphContainer";

beforeAll(() => {
  mockReactFlow();
});

it("drops different node types on the graph", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  dropNode({ nodeType: "CONSTANT" });
  dropNode({ nodeType: "VARIABLE" });
  dropNode({ nodeType: "OPERATION", operationId: "sum" });

  // TODO(sc420): Dump the graph by json and check if 3 nodes are there
  expect(screen.getByText("c1")).toBeInTheDocument();
  expect(screen.getByText("v2")).toBeInTheDocument();
  expect(screen.getByText("sum3")).toBeInTheDocument();
});

it("connects two constant nodes to a sum node, and removes the sum node", () => {
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

  // TODO(sc420): Dump the graph by json and check if there're only 2 nodes left
  expect(screen.getByText("c1")).toBeInTheDocument();
  expect(screen.getByText("c2")).toBeInTheDocument();
  expect(screen.queryByText("sum3")).toBeNull();
});

const removeNode = (ids: string[]): void => {
  const onNodesChangeRemoveJsonIds = screen.getByRole("textbox", {
    name: "onNodesChange.remove.jsonIds",
  });
  const jsonIds = JSON.stringify(ids);
  fireEvent.change(onNodesChangeRemoveJsonIds, { target: { value: jsonIds } });
  const triggerOnNodesChangeRemoveButton = screen.getByRole("button", {
    name: "Trigger onNodesChange: remove",
  });
  fireEvent.click(triggerOnNodesChangeRemoveButton);
};

const removeEdge = (ids: string[]): void => {
  const onEdgesChangeRemoveJsonIds = screen.getByRole("textbox", {
    name: "onEdgesChange.remove.jsonIds",
  });
  const jsonIds = JSON.stringify(ids);
  fireEvent.change(onEdgesChangeRemoveJsonIds, { target: { value: jsonIds } });
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

const dropNode = (featureNodeType: FeatureNodeType): void => {
  const onDropNodeJsonFeatureNodeType = screen.getByRole("textbox", {
    name: "onDropNode.jsonFeatureNodeType",
  });
  const jsonFeatureNodeType = JSON.stringify(featureNodeType);
  fireEvent.change(onDropNodeJsonFeatureNodeType, {
    target: { value: jsonFeatureNodeType },
  });
  const triggerOnEdgesChangeRemoveButton = screen.getByRole("button", {
    name: "Trigger onDropNode",
  });
  fireEvent.click(triggerOnEdgesChangeRemoveButton);
};
