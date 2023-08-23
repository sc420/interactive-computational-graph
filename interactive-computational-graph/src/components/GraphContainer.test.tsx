import { fireEvent, render, screen } from "@testing-library/react";
import { type Connection } from "reactflow";
import { mockReactFlow } from "../ReactFlowMock";
import type FeatureNodeType from "../features/FeatureNodeType";
import { randomInteger } from "../features/RandomUtilities";
import GraphContainer from "./GraphContainer";

jest.mock("../features/RandomUtilities");

beforeAll(() => {
  mockReactFlow();
});

beforeEach(() => {
  (randomInteger as jest.Mock).mockReturnValue(100);
});

it("drops different node types on the graph", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  dropNode({ nodeType: "CONSTANT" });
  dropNode({ nodeType: "VARIABLE" });
  dropNode({ nodeType: "OPERATION", operationId: "sum" });

  expect(screen.getByText("c1")).toBeInTheDocument();
  expect(screen.getByText("v2")).toBeInTheDocument();
  expect(screen.getByText("sum3")).toBeInTheDocument();

  const reactFlowData = {
    nodes: getNodes(),
    edges: getEdges(),
  };
  expect(reactFlowData).toMatchSnapshot();
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

  expect(screen.getByText("c1")).toBeInTheDocument();
  expect(screen.getByText("c2")).toBeInTheDocument();
  expect(screen.queryByText("sum3")).toBeNull();

  const reactFlowData = {
    nodes: getNodes(),
    edges: getEdges(),
  };
  expect(reactFlowData).toMatchSnapshot();
});

const getNodes = (): Node[] => {
  const jsonNodes = screen.getByRole("textbox", {
    name: "jsonNodes",
  });
  return JSON.parse((jsonNodes as HTMLInputElement).value);
};

const getEdges = (): Node[] => {
  const jsonEdges = screen.getByRole("textbox", {
    name: "jsonEdges",
  });
  return JSON.parse((jsonEdges as HTMLInputElement).value);
};

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
  const connection: Connection = {
    source,
    sourceHandle,
    target,
    targetHandle,
  };
  const jsonConnection = JSON.stringify(connection);
  const onConnectJsonConnection = screen.getByRole("textbox", {
    name: "onConnect.jsonConnection",
  });
  fireEvent.change(onConnectJsonConnection, {
    target: { value: jsonConnection },
  });
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
