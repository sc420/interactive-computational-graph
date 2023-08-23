import { fireEvent, render, screen } from "@testing-library/react";
import {
  type Connection,
  type Edge,
  type Node,
  type OnSelectionChangeParams,
} from "reactflow";
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

it("should have different node types on the graph after dropping nodes", () => {
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

it("should select the last dropped node", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  changeSelection([], []);

  // Add a constant node
  dropNode({ nodeType: "CONSTANT" });

  const nodes1 = getNodes();
  changeSelection(nodes1, []);

  // Add another constant node
  dropNode({ nodeType: "CONSTANT" });

  // Get only the second added node
  const nodes2 = getNodes().filter((node) => node.id === "2");
  changeSelection(nodes2, []);

  const reactFlowData = {
    nodes: getNodes(),
    edges: getEdges(),
  };
  expect(reactFlowData).toMatchSnapshot();
});

it("edges and sum node itself should be removed after removing sum node", () => {
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

it("input text fields should hide/show properly", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  expect(screen.getByTestId("input-item-3-x_i")).toBeInTheDocument();

  // Connect from the 1st constant node to the sum node
  connectEdge("1", "output", "3", "x_i");

  expect(screen.queryByTestId("input-item-3-x_i")).toBeNull();

  // Connect from the 2nd constant node to the sum node
  connectEdge("2", "output", "3", "x_i");

  expect(screen.queryByTestId("input-item-3-x_i")).toBeNull();

  // Disconnect from the constant nodes to the sum node
  removeEdge(["reactflow__edge-1output-3x_i", "reactflow__edge-2output-3x_i"]);

  expect(screen.getByTestId("input-item-3-x_i")).toBeInTheDocument();
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

const changeSelection = (nodes: Node[], edges: Edge[]): void => {
  const onSelectionChangeJsonParams = screen.getByRole("textbox", {
    name: "onSelectionChange.jsonParams",
  });
  const params: OnSelectionChangeParams = { nodes, edges };
  const jsonParams = JSON.stringify(params);
  fireEvent.change(onSelectionChangeJsonParams, {
    target: { value: jsonParams },
  });
  const triggerOnSelectionChangeButton = screen.getByRole("button", {
    name: "Trigger onSelectionChange",
  });
  fireEvent.click(triggerOnSelectionChangeButton);
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
