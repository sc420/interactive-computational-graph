import { fireEvent, render, screen, within } from "@testing-library/react";
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

it("edges and add node itself should be removed after removing add node", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add an add node
  const sumItem = screen.getByText("Add");
  fireEvent.click(sumItem);

  // Connect from the constant nodes to the add node
  connectEdge("1", "output", "3", "a");
  connectEdge("2", "output", "3", "b");

  // Remove the add node
  removeEdge(["reactflow__edge-1output-3a", "reactflow__edge-2output-3b"]);
  removeNode(["3"]);

  expect(screen.getByText("c1")).toBeInTheDocument();
  expect(screen.getByText("c2")).toBeInTheDocument();
  expect(screen.queryByText("add3")).toBeNull();

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

it("can connect same node to multiple ports, then remove the connections", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  // Add a variable node
  const variableItem = screen.getByText("Variable");
  fireEvent.click(variableItem);

  // Add a add node
  const addItem = screen.getByText("Add");
  fireEvent.click(addItem);

  // Connect from the variable node to the add node
  connectEdge("1", "output", "2", "a");
  connectEdge("1", "output", "2", "b");

  // Disconnect from the variable node to the add node
  removeEdge(["reactflow__edge-1output-2a"]);
  removeEdge(["reactflow__edge-1output-2b"]);
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

it("should show error message when connecting the same edge twice", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  // Add a constant node
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  // Connect from the 1st constant node to the add node port a twice
  connectEdge("1", "output", "2", "x_i");
  expect(screen.queryByRole("alert")).toBeNull();
  connectEdge("1", "output", "2", "x_i");

  const snackbar = screen.getByRole("alert");
  expect(snackbar).toBeInTheDocument();
  expect(snackbar).toHaveTextContent(
    "Input node 1 already exists by port x_i of node 2",
  );
});

it("should show error message when connecting to the single-connection port", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add an add node
  const sumItem = screen.getByText("Add");
  fireEvent.click(sumItem);

  // Connect from the 2nd constant node to the add node port a
  connectEdge("1", "output", "3", "a");
  connectEdge("2", "output", "3", "a");

  const snackbar = screen.getByRole("alert");
  expect(snackbar).toBeInTheDocument();
  expect(snackbar).toHaveTextContent(
    "Input port a of node 3 doesn't allow multiple edges",
  );
});

it("should show error message when causing a cycle", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  // Connect from the output of sum node to the input of sum node
  connectEdge("1", "output", "1", "x_i");

  const snackbar = screen.getByRole("alert");
  expect(snackbar).toBeInTheDocument();
  expect(snackbar).toHaveTextContent(
    "Connecting node 1 to node 1 would cause a cycle",
  );
});

it("derivative target should reset when the target node is removed", () => {
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

  // Select the sum node as the derivative target
  setDerivativeTarget("3");

  // Remove the sum node
  removeEdge(["reactflow__edge-1output-3x_i", "reactflow__edge-2output-3x_i"]);
  removeNode(["3"]);

  expect(getDerivativeTarget()).toBe("");
});

// It uses example from https://colah.github.io/posts/2015-08-Backprop/
it("derivative values should change when derivative mode/target is changed", () => {
  render(<GraphContainer selectedFeature="dashboard" />);

  // Add the nodes
  const variableItem = screen.getByText("Variable");
  const addItem = screen.getByText("Add");
  const multiplyItem = screen.getByText("Multiply");
  fireEvent.click(variableItem); // id=1
  fireEvent.click(variableItem); // id=2
  fireEvent.click(addItem); // id=3
  fireEvent.click(addItem); // id=4
  fireEvent.click(multiplyItem); // id=5

  // Connect from the variable nodes to add nodes
  connectEdge("1", "output", "3", "a");
  connectEdge("2", "output", "3", "b");
  connectEdge("2", "output", "4", "a");

  // Set add node input values
  setInputItemValue("1", "value", "2");
  setInputItemValue("2", "value", "1");
  setInputItemValue("4", "b", "1");

  // Connect from the add nodes to multiply node
  connectEdge("3", "output", "5", "a");
  connectEdge("4", "output", "5", "b");

  // Select the multiply node as the derivative target
  setDerivativeTarget("5");

  // Check the output values
  expect(getOutputItemValue("3", "VALUE")).toBe("3");
  expect(getOutputItemValue("4", "VALUE")).toBe("2");
  expect(getOutputItemValue("5", "VALUE")).toBe("6");

  // Check the derivative values
  expect(getOutputItemValue("1", "DERIVATIVE")).toBe("2");
  expect(getOutputItemValue("2", "DERIVATIVE")).toBe("5");
  expect(getOutputItemValue("3", "DERIVATIVE")).toBe("2");
  expect(getOutputItemValue("4", "DERIVATIVE")).toBe("3");
  expect(getOutputItemValue("5", "DERIVATIVE")).toBe("1");

  // Change the differentiation mode to forward mode
  toggleDifferentiationMode();

  // Check the output values
  expect(getOutputItemValue("3", "VALUE")).toBe("3");
  expect(getOutputItemValue("4", "VALUE")).toBe("2");
  expect(getOutputItemValue("5", "VALUE")).toBe("6");

  // Check the derivative values
  expect(getOutputItemValue("1", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("2", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("3", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("4", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("5", "DERIVATIVE")).toBe("1");

  // Select the second variable node as the derivative target
  setDerivativeTarget("2");

  // Check the output values
  expect(getOutputItemValue("3", "VALUE")).toBe("3");
  expect(getOutputItemValue("4", "VALUE")).toBe("2");
  expect(getOutputItemValue("5", "VALUE")).toBe("6");

  // Check the derivative values
  expect(getOutputItemValue("1", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("2", "DERIVATIVE")).toBe("1");
  expect(getOutputItemValue("3", "DERIVATIVE")).toBe("1");
  expect(getOutputItemValue("4", "DERIVATIVE")).toBe("1");
  expect(getOutputItemValue("5", "DERIVATIVE")).toBe("5");
});

const toggleDifferentiationMode = (): void => {
  const switchLabel = screen.getByLabelText("Reverse-Mode Differentiation");
  fireEvent.click(switchLabel);
};

const getDerivativeTarget = (): string => {
  const derivativeTargetAutocomplete = screen.getByTestId("derivative-target");
  const input = within(derivativeTargetAutocomplete).getByRole("combobox");
  return (input as HTMLInputElement).value;
};

const setDerivativeTarget = (targetNodeId: string): void => {
  const derivativeTargetAutocomplete = screen.getByTestId("derivative-target");
  const input = within(derivativeTargetAutocomplete).getByRole("combobox");

  fireEvent.click(derivativeTargetAutocomplete);
  fireEvent.change(input, { target: { value: targetNodeId } });
  fireEvent.keyDown(derivativeTargetAutocomplete, { key: "ArrowDown" });
  fireEvent.keyDown(derivativeTargetAutocomplete, { key: "Enter" });

  // Check if the input has been updated successfully
  expect(input).toHaveValue(targetNodeId);
};

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

const setInputItemValue = (
  nodeId: string,
  portId: string,
  value: string,
): void => {
  const inputItem = screen.getByTestId(`input-item-${nodeId}-${portId}`);
  const input = within(inputItem).getByRole("textbox");
  fireEvent.change(input, {
    target: { value },
  });
};

const getOutputItemValue = (nodeId: string, portId: string): string => {
  const inputItem = screen.getByTestId(`output-item-${nodeId}-${portId}`);
  const input = within(inputItem).getByRole("textbox");
  return (input as HTMLInputElement).value;
};
