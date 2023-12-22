import { fireEvent, render, screen, within } from "@testing-library/react";
import {
  type Connection,
  type Edge,
  type Node,
  type OnSelectionChangeParams,
} from "reactflow";
import { mockReactFlow } from "../ReactFlowMock";
import type FeatureNodeType from "../features/FeatureNodeType";
import type SelectedFeature from "../features/SelectedFeature";
import GraphContainer from "./GraphContainer";

jest.mock("../features/RandomUtilities");

// If we don't mock katex, there would be some strange error:
// `TypeError: Cannot read properties of undefined (reading 'getPropertyValue')`
jest.mock("../latex/Katex");

beforeAll(() => {
  mockReactFlow();
});

it("should have different node types on the graph after dropping nodes", () => {
  renderGraphContainer();

  dropNode({ nodeType: "CONSTANT" });
  dropNode({ nodeType: "VARIABLE" });
  dropNode({ nodeType: "OPERATION", operationId: "sum" });

  expect(screen.getByText("c_1")).toBeInTheDocument();
  expect(screen.getByText("v_1")).toBeInTheDocument();
  expect(screen.getByText("s_1")).toBeInTheDocument();

  const reactFlowData = {
    nodes: getNodes(),
    edges: getEdges(),
  };
  expect(reactFlowData).toMatchSnapshot();
});

it("should select the last dropped node", () => {
  renderGraphContainer();

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
  renderGraphContainer();

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add an add node
  const sumItem = screen.getByText("Add");
  fireEvent.click(sumItem);

  // Connect from the constant nodes to the add node
  connectEdge("0", "output", "2", "a");
  connectEdge("1", "output", "2", "b");

  // Remove the add node
  removeEdge(["reactflow__edge-0output-2a", "reactflow__edge-1output-2b"]);
  removeNode(["2"]);

  expect(screen.getByText("c_1")).toBeInTheDocument();
  expect(screen.getByText("c_1")).toBeInTheDocument();
  expect(screen.queryByText("a_1")).toBeNull();

  const reactFlowData = {
    nodes: getNodes(),
    edges: getEdges(),
  };
  expect(reactFlowData).toMatchSnapshot();
});

it("edges and sum node itself should be removed after removing sum node", () => {
  renderGraphContainer();

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  // Connect from the constant nodes to the sum node
  connectEdge("0", "output", "2", "x_i");
  connectEdge("1", "output", "2", "x_i");

  // Remove the sum node
  removeEdge(["reactflow__edge-0output-2x_i", "reactflow__edge-1output-2x_i"]);
  removeNode(["2"]);

  expect(screen.getByText("c_1")).toBeInTheDocument();
  expect(screen.getByText("c_2")).toBeInTheDocument();
  expect(screen.queryByText("s_1")).toBeNull();

  const reactFlowData = {
    nodes: getNodes(),
    edges: getEdges(),
  };
  expect(reactFlowData).toMatchSnapshot();
});

it("can connect same node to multiple ports, then remove the connections", () => {
  renderGraphContainer();

  // Add a variable node
  const variableItem = screen.getByText("Variable");
  fireEvent.click(variableItem);

  // Add a add node
  const addItem = screen.getByText("Add");
  fireEvent.click(addItem);

  // Connect from the variable node to the add node
  connectEdge("0", "output", "1", "a");
  connectEdge("0", "output", "1", "b");

  // Disconnect from the variable node to the add node
  removeEdge(["reactflow__edge-0output-1a"]);
  removeEdge(["reactflow__edge-0output-1b"]);
});

it("input text fields should hide/show properly", () => {
  renderGraphContainer();

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  expect(screen.getByTestId("input-item-2-x_i")).toBeInTheDocument();

  // Connect from the 1st constant node to the sum node
  connectEdge("0", "output", "2", "x_i");

  expect(screen.queryByTestId("input-item-2-x_i")).toBeNull();

  // Connect from the 2nd constant node to the sum node
  connectEdge("1", "output", "2", "x_i");

  expect(screen.queryByTestId("input-item-2-x_i")).toBeNull();

  // Disconnect from the constant nodes to the sum node
  removeEdge(["reactflow__edge-0output-2x_i", "reactflow__edge-1output-2x_i"]);

  expect(screen.getByTestId("input-item-2-x_i")).toBeInTheDocument();
});

it("should show error message when connecting the same edge twice", () => {
  renderGraphContainer();

  // Add a constant node
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  // Connect from the 1st constant node to the add node port a twice
  connectEdge("0", "output", "1", "x_i");
  expect(screen.queryByRole("alert")).toBeNull();
  connectEdge("0", "output", "1", "x_i");

  const snackbar = screen.getByRole("alert");
  expect(snackbar).toBeInTheDocument();
  expect(snackbar).toHaveTextContent(
    "Input node c_1 is already connected to node s_1 by port x_i",
  );
});

it("should show error message when connecting to the single-connection port", () => {
  renderGraphContainer();

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add an add node
  const sumItem = screen.getByText("Add");
  fireEvent.click(sumItem);

  // Connect from the 2nd constant node to the add node port a
  connectEdge("0", "output", "2", "a");
  connectEdge("1", "output", "2", "a");

  const snackbar = screen.getByRole("alert");
  expect(snackbar).toBeInTheDocument();
  expect(snackbar).toHaveTextContent(
    "Input port a of node a_1 doesn't allow multiple edges",
  );
});

it("should show error message when causing a cycle", () => {
  renderGraphContainer();

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  // Connect from the output of sum node to the input of sum node
  connectEdge("0", "output", "0", "x_i");

  const snackbar = screen.getByRole("alert");
  expect(snackbar).toBeInTheDocument();
  expect(snackbar).toHaveTextContent(
    "Connecting node s_1 to node s_1 would cause a cycle",
  );
});

it("derivative target should reset when the target node is removed", () => {
  renderGraphContainer();

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  // Connect from the constant nodes to the sum node
  connectEdge("0", "output", "2", "x_i");
  connectEdge("1", "output", "2", "x_i");

  // Select the sum node as the derivative target
  setDerivativeTarget("s_1");

  // Remove the sum node
  removeEdge(["reactflow__edge-0output-2x_i", "reactflow__edge-1output-2x_i"]);
  removeNode(["2"]);

  expect(getDerivativeTarget()).toBe("");
});

it("derivative target name should update when the node name is updated", () => {
  renderGraphContainer();

  // Add two constant nodes
  const constantItem = screen.getByText("Constant");
  fireEvent.click(constantItem);
  fireEvent.click(constantItem);

  // Add a sum node
  const sumItem = screen.getByText("Sum");
  fireEvent.click(sumItem);

  // Connect from the constant nodes to the sum node
  connectEdge("0", "output", "2", "x_i");
  connectEdge("1", "output", "2", "x_i");

  // Select the sum node as the derivative target
  setDerivativeTarget("s_1");

  // Update the node name of the sum node
  setNodeName("2", "s_1");

  expect(getDerivativeTarget()).toBe("s_1");
});

it("outputs should be set correctly after adding the nodes", () => {
  renderGraphContainer();

  // Add the nodes
  const addItem = screen.getByText("Add");
  const cosItem = screen.getByText("Cos");
  fireEvent.click(addItem); // id=0
  fireEvent.click(cosItem); // id=1

  // Check the output values
  expect(getOutputItemValue("0", "VALUE")).toBe("0");
  expect(getOutputItemValue("1", "VALUE")).toBe("1");
});

// It uses example from https://colah.github.io/posts/2015-08-Backprop/
it("outputs should change when derivative mode/target is changed", () => {
  renderGraphContainer();

  // Add the nodes
  const variableItem = screen.getByText("Variable");
  const addItem = screen.getByText("Add");
  const multiplyItem = screen.getByText("Multiply");
  fireEvent.click(variableItem); // id=0
  fireEvent.click(variableItem); // id=1
  fireEvent.click(addItem); // id=2
  fireEvent.click(addItem); // id=3
  fireEvent.click(multiplyItem); // id=4

  // Connect from the variable nodes to add nodes
  connectEdge("0", "output", "2", "a");
  connectEdge("1", "output", "2", "b");
  connectEdge("1", "output", "3", "a");

  // Set add node input values
  setInputItemValue("0", "value", "2");
  setInputItemValue("1", "value", "1");
  setInputItemValue("3", "b", "1");

  // Connect from the add nodes to multiply node
  connectEdge("2", "output", "4", "a");
  connectEdge("3", "output", "4", "b");

  // Select the multiply node as the derivative target
  setDerivativeTarget("m_1");

  // Check the output values
  expect(getOutputItemValue("2", "VALUE")).toBe("3");
  expect(getOutputItemValue("3", "VALUE")).toBe("2");
  expect(getOutputItemValue("4", "VALUE")).toBe("6");

  // Check the derivative labels
  expect(getOutputItemLabelText("0", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{m_1}}{\\partial{v_1}}=",
  );
  expect(getOutputItemLabelText("1", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{m_1}}{\\partial{v_2}}=",
  );
  expect(getOutputItemLabelText("2", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{m_1}}{\\partial{a_1}}=",
  );
  expect(getOutputItemLabelText("3", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{m_1}}{\\partial{a_2}}=",
  );
  expect(getOutputItemLabelText("4", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{m_1}}{\\partial{m_1}}=",
  );

  // Check the derivative values
  expect(getOutputItemValue("0", "DERIVATIVE")).toBe("2");
  expect(getOutputItemValue("1", "DERIVATIVE")).toBe("5");
  expect(getOutputItemValue("2", "DERIVATIVE")).toBe("2");
  expect(getOutputItemValue("3", "DERIVATIVE")).toBe("3");
  expect(getOutputItemValue("4", "DERIVATIVE")).toBe("1");

  // Change the differentiation mode to forward mode
  toggleDifferentiationMode();

  // Check the output values
  expect(getOutputItemValue("2", "VALUE")).toBe("3");
  expect(getOutputItemValue("3", "VALUE")).toBe("2");
  expect(getOutputItemValue("4", "VALUE")).toBe("6");

  // Check the derivative labels
  expect(getOutputItemLabelText("0", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{v_1}}{\\partial{m_1}}=",
  );
  expect(getOutputItemLabelText("1", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{v_2}}{\\partial{m_1}}=",
  );
  expect(getOutputItemLabelText("2", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{a_1}}{\\partial{m_1}}=",
  );
  expect(getOutputItemLabelText("3", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{a_2}}{\\partial{m_1}}=",
  );
  expect(getOutputItemLabelText("4", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{m_1}}{\\partial{m_1}}=",
  );

  // Check the derivative values
  expect(getOutputItemValue("0", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("1", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("2", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("3", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("4", "DERIVATIVE")).toBe("1");

  // Select the second variable node as the derivative target
  setDerivativeTarget("v_2");

  // Check the output values
  expect(getOutputItemValue("2", "VALUE")).toBe("3");
  expect(getOutputItemValue("3", "VALUE")).toBe("2");
  expect(getOutputItemValue("4", "VALUE")).toBe("6");

  // Check the derivative labels
  expect(getOutputItemLabelText("0", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{v_1}}{\\partial{v_2}}=",
  );
  expect(getOutputItemLabelText("1", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{v_2}}{\\partial{v_2}}=",
  );
  expect(getOutputItemLabelText("2", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{a_1}}{\\partial{v_2}}=",
  );
  expect(getOutputItemLabelText("3", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{a_2}}{\\partial{v_2}}=",
  );
  expect(getOutputItemLabelText("4", "DERIVATIVE")).toBe(
    "\\displaystyle \\frac{\\partial{m_1}}{\\partial{v_2}}=",
  );

  // Check the derivative values
  expect(getOutputItemValue("0", "DERIVATIVE")).toBe("0");
  expect(getOutputItemValue("1", "DERIVATIVE")).toBe("1");
  expect(getOutputItemValue("2", "DERIVATIVE")).toBe("1");
  expect(getOutputItemValue("3", "DERIVATIVE")).toBe("1");
  expect(getOutputItemValue("4", "DERIVATIVE")).toBe("5");
});

const renderGraphContainer = (): void => {
  render(
    <GraphContainer
      isSidebarOpen={false}
      onToggleSidebar={() => {}}
      selectedFeature="add-nodes"
      onSelectFeature={(feature: SelectedFeature | null) => {}}
      isDarkMode={false}
      onToggleDarkMode={() => {}}
    />,
  );
};

const toggleDifferentiationMode = (): void => {
  const switchLabel = screen.getByLabelText("Reverse-Mode Differentiation");
  fireEvent.click(switchLabel);
};

const getDerivativeTarget = (): string => {
  const derivativeTargetAutocomplete = screen.getByTestId("derivative-target");
  const input = within(derivativeTargetAutocomplete).getByRole("combobox");
  return (input as HTMLInputElement).value;
};

const setDerivativeTarget = (targetNodeName: string): void => {
  const derivativeTargetAutocomplete = screen.getByTestId("derivative-target");
  const input = within(derivativeTargetAutocomplete).getByRole("combobox");

  fireEvent.click(derivativeTargetAutocomplete);
  fireEvent.change(input, { target: { value: targetNodeName } });
  fireEvent.keyDown(derivativeTargetAutocomplete, { key: "ArrowDown" });
  fireEvent.keyDown(derivativeTargetAutocomplete, { key: "Enter" });

  // Check if the input has been updated successfully
  expect(input).toHaveValue(targetNodeName);
};

const getNodes = (): Node[] => {
  const jsonNodes = screen.getByTestId("jsonNodes");
  return JSON.parse((jsonNodes as HTMLInputElement).value);
};

const getEdges = (): Node[] => {
  const jsonEdges = screen.getByTestId("jsonEdges");
  return JSON.parse((jsonEdges as HTMLInputElement).value);
};

const removeNode = (ids: string[]): void => {
  const onNodesChangeRemoveJsonIds = screen.getByTestId(
    "onNodesChange.remove.jsonIds",
  );
  const jsonIds = JSON.stringify(ids);
  fireEvent.change(onNodesChangeRemoveJsonIds, { target: { value: jsonIds } });
  const triggerOnNodesChangeRemoveButton = screen.getByTestId(
    "trigger.onNodesChange.remove",
  );
  fireEvent.click(triggerOnNodesChangeRemoveButton);
};

const removeEdge = (ids: string[]): void => {
  const onEdgesChangeRemoveJsonIds = screen.getByTestId(
    "onEdgesChange.remove.jsonIds",
  );
  const jsonIds = JSON.stringify(ids);
  fireEvent.change(onEdgesChangeRemoveJsonIds, { target: { value: jsonIds } });
  const triggerOnEdgesChangeRemoveButton = screen.getByTestId(
    "trigger.onEdgesChange.remove",
  );
  fireEvent.click(triggerOnEdgesChangeRemoveButton);
};

const changeSelection = (nodes: Node[], edges: Edge[]): void => {
  const onSelectionChangeJsonParams = screen.getByTestId(
    "onSelectionChange.jsonParams",
  );
  const params: OnSelectionChangeParams = { nodes, edges };
  const jsonParams = JSON.stringify(params);
  fireEvent.change(onSelectionChangeJsonParams, {
    target: { value: jsonParams },
  });
  const triggerOnSelectionChangeButton = screen.getByTestId(
    "trigger.onSelectionChange",
  );
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
  const onConnectJsonConnection = screen.getByTestId(
    "onConnect.jsonConnection",
  );
  fireEvent.change(onConnectJsonConnection, {
    target: { value: jsonConnection },
  });
  const triggerOnConnectButton = screen.getByTestId("trigger.onConnect");
  fireEvent.click(triggerOnConnectButton);
};

const dropNode = (featureNodeType: FeatureNodeType): void => {
  const onDropNodeJsonFeatureNodeType = screen.getByTestId(
    "onDropNode.jsonFeatureNodeType",
  );
  const jsonFeatureNodeType = JSON.stringify(featureNodeType);
  fireEvent.change(onDropNodeJsonFeatureNodeType, {
    target: { value: jsonFeatureNodeType },
  });
  const triggerOnEdgesChangeRemoveButton =
    screen.getByTestId("trigger.onDropNode");
  fireEvent.click(triggerOnEdgesChangeRemoveButton);
};

const setNodeName = (nodeId: string, name: string): void => {
  const nodeTitle = screen.getByTestId(`node-title-${nodeId}`);
  const editIcon = within(nodeTitle).getByRole("button", { name: "edit" });
  fireEvent.click(editIcon);

  const input = within(nodeTitle).getByRole("textbox");
  fireEvent.change(input, {
    target: { value: name },
  });
  fireEvent.keyDown(input, { key: "Enter" });
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

const getOutputItemLabelText = (
  nodeId: string,
  portId: string,
): string | null => {
  const outputLabel = screen.getByTestId(
    `label-output-item-${nodeId}-${portId}`,
  );
  return outputLabel.textContent;
};

const getOutputItemValue = (nodeId: string, portId: string): string => {
  const outputItem = screen.getByTestId(`output-item-${nodeId}-${portId}`);
  const output = within(outputItem).getByRole("textbox");
  return (output as HTMLInputElement).value;
};
