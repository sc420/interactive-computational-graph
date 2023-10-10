import {
  type Connection,
  type Edge,
  type EdgeChange,
  type EdgeRemoveChange,
  type EdgeSelectionChange,
  type NodeChange,
  type NodePositionChange,
  type NodeRemoveChange,
} from "reactflow";
import { CycleError } from "../core/CoreErrors";
import type DifferentiationMode from "../core/DifferentiationMode";
import Operation from "../core/Operation";
import Port from "../core/Port";
import { ADD_DFDX_CODE, ADD_F_CODE } from "./BuiltInCode";
import CoreGraphAdapter from "./CoreGraphAdapter";
import type ExplainDerivativeData from "./ExplainDerivativeData";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";

describe("events", () => {
  test("should emit output updates when adding node", () => {
    const adapter = new CoreGraphAdapter();
    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    addConstantNode(adapter, "c1");

    const expectedNodeIdToFValues = new Map<string, string>([["c1", "0"]]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["c1", "0"],
    ]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit events when adding connection successfully", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "c1");
    addAddNode(adapter, "add1");

    const handleConnectionAdded = jest.fn();
    const handleHideInputField = jest.fn();
    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onConnectionAdded(handleConnectionAdded);
    adapter.onHideInputField(handleHideInputField);
    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    const connection = addConnection(adapter, "c1", "add1", "a");

    expect(handleConnectionAdded).toHaveBeenCalledWith(connection);
    expect(handleHideInputField).toHaveBeenCalledWith(connection);
    const expectedNodeIdToFValues = new Map<string, string>([
      ["c1", "0"],
      ["add1", "0"],
      ["dummy-input-node-add1-a", "0"],
      ["dummy-input-node-add1-b", "0"],
    ]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["c1", "0"],
      ["add1", "0"],
      ["dummy-input-node-add1-a", "0"],
      ["dummy-input-node-add1-b", "0"],
    ]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit events when there's error when adding connection", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "add1");

    const handleConnectionAdded = jest.fn();
    const handleConnectionError = jest.fn();
    const handleHideInputField = jest.fn();
    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();
    adapter.onConnectionAdded(handleConnectionAdded);
    adapter.onConnectionError(handleConnectionError);
    adapter.onHideInputField(handleHideInputField);
    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    addConnection(adapter, "add1", "add1", "a");

    expect(handleConnectionAdded).not.toHaveBeenCalled();
    expect(handleConnectionError).toHaveBeenCalledWith(
      new CycleError("Connecting node add1 to node add1 would cause a cycle"),
    );
    expect(handleHideInputField).not.toHaveBeenCalled();
    expect(handleFValuesUpdated).not.toHaveBeenCalled();
    expect(handleDerivativeValuesUpdated).not.toHaveBeenCalled();
    expect(handleExplainDerivativeDataUpdated).not.toHaveBeenCalled();
  });

  test("should emit output updates when setting differentiation mode", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "c1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    adapter.setDifferentiationMode("FORWARD");

    const expectedNodeIdToFValues = new Map<string, string>([["c1", "0"]]);
    const expectedDifferentiationMode: DifferentiationMode = "FORWARD";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["c1", "0"],
    ]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit output updates when setting target node", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "c1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    adapter.setTargetNode("c1");

    const expectedNodeIdToFValues = new Map<string, string>([["c1", "0"]]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = "c1";
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["c1", "0"],
    ]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit events when updating node name", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "c1");

    const handleNodeNameUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onNodeNameUpdated(handleNodeNameUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    adapter.updateNodeNameById("c1", "c_2");

    expect(handleNodeNameUpdated).toHaveBeenCalledWith("c1", "c_2");
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit output updates when updating node value", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "add1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    adapter.updateNodeValueById("add1", "a", "1");

    const expectedNodeIdToFValues = new Map<string, string>([
      ["add1", "1"],
      ["dummy-input-node-add1-a", "1"],
      ["dummy-input-node-add1-b", "0"],
    ]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["add1", "0"],
      ["dummy-input-node-add1-a", "0"],
      ["dummy-input-node-add1-b", "0"],
    ]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit output updates when removing the node", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "add1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    removeNode(adapter, "add1");

    const expectedNodeIdToFValues = new Map<string, string>([]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit target node update when removing the target node", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "add1");
    adapter.setTargetNode("add1");

    const handleTargetNodeUpdated = jest.fn();

    adapter.onTargetNodeUpdated(handleTargetNodeUpdated);

    removeNode(adapter, "add1");

    expect(handleTargetNodeUpdated).toHaveBeenCalledWith(null);
  });

  test("should not emit output updates when doing other node changes", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "add1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    const change: NodePositionChange = {
      id: "add1",
      type: "position",
      position: {
        x: 100,
        y: 100,
      },
    };
    const changes: NodeChange[] = [change];
    adapter.changeNodes(changes);

    expect(handleFValuesUpdated).not.toHaveBeenCalled();
    expect(handleDerivativeValuesUpdated).not.toHaveBeenCalled();
    expect(handleExplainDerivativeDataUpdated).not.toHaveBeenCalled();
  });

  test("should emit events when removing connection", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "c1");
    addAddNode(adapter, "add1");
    addConnection(adapter, "c1", "add1", "a");

    const handleShowInputFields = jest.fn();
    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onShowInputFields(handleShowInputFields);
    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    const edges = buildReactFlowEdges([["c1", "add1", "a"]]);
    removeEdge(adapter, "c1", "add1", "a", edges);

    expect(handleShowInputFields).toHaveBeenCalledWith(edges);
    const expectedNodeIdToFValues = new Map<string, string>([
      ["c1", "0"],
      ["add1", "0"],
      ["dummy-input-node-add1-a", "0"],
      ["dummy-input-node-add1-b", "0"],
    ]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["c1", "0"],
      ["add1", "0"],
      ["dummy-input-node-add1-a", "0"],
      ["dummy-input-node-add1-b", "0"],
    ]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should not emit events when doing other connection changes", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "c1");
    addAddNode(adapter, "add1");
    addConnection(adapter, "c1", "add1", "a");

    const handleShowInputFields = jest.fn();
    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onShowInputFields(handleShowInputFields);
    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    const change: EdgeSelectionChange = {
      id: getReactFlowEdgeId("c1", "add1", "a"),
      type: "select",
      selected: true,
    };
    const changes: EdgeChange[] = [change];
    const edges = buildReactFlowEdges([["c1", "add1", "a"]]);
    adapter.changeEdges(changes, edges);

    expect(handleShowInputFields).not.toHaveBeenCalled();
    expect(handleFValuesUpdated).not.toHaveBeenCalled();
    expect(handleDerivativeValuesUpdated).not.toHaveBeenCalled();
    expect(handleExplainDerivativeDataUpdated).not.toHaveBeenCalled();
  });

  test("should emit non-empty explain derivative data when selecting nodes", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "c1");
    adapter.setTargetNode("c1");

    const explainDerivativeDataUpdated = jest.fn();

    adapter.onExplainDerivativeDataUpdated(explainDerivativeDataUpdated);

    adapter.updateSelectedNodes(["c1"]);

    const firstCallArgs = explainDerivativeDataUpdated.mock.calls[0];
    const data = firstCallArgs[0];
    expect(data).toHaveLength(1);
  });

  test("should emit empty explain derivative data when selecting nodes with null target node", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "c1");

    const explainDerivativeDataUpdated = jest.fn();

    adapter.onExplainDerivativeDataUpdated(explainDerivativeDataUpdated);

    adapter.updateSelectedNodes(["c1"]);

    const expectedData: ExplainDerivativeData[] = [];
    expect(explainDerivativeDataUpdated).toHaveBeenCalledWith(expectedData);
  });
});

describe("behavior", () => {
  test("should not throw error when the current selected node is removed", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "c1");
    addAddNode(adapter, "add1");
    addConnection(adapter, "c1", "add1", "a");

    adapter.setTargetNode("add1");
    adapter.updateSelectedNodes(["c1"]);

    const edges = buildReactFlowEdges([["c1", "add1", "a"]]);
    // Should remove edge first
    removeEdge(adapter, "c1", "add1", "a", edges);
    // Should remove node later
    removeNode(adapter, "c1");
  });
});

const featureOperation: FeatureOperation = {
  id: "add",
  text: "Add",
  type: "SIMPLE",
  operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
  inputPorts: [new Port("a", false), new Port("b", false)],
  helpText: "Add two numbers $ a + b $",
};

const addConstantNode = (adapter: CoreGraphAdapter, nodeId: string): void => {
  const featureType: FeatureNodeType = { nodeType: "CONSTANT" };
  const nodeName = `c_${nodeId}`;
  adapter.addNode(featureType, featureOperation, nodeId, nodeName);
};

const addAddNode = (adapter: CoreGraphAdapter, nodeId: string): void => {
  const featureType: FeatureNodeType = {
    nodeType: "OPERATION",
    operationId: "add",
  };
  const nodeName = `add_${nodeId}`;
  adapter.addNode(featureType, featureOperation, nodeId, nodeName);
};

const addConnection = (
  adapter: CoreGraphAdapter,
  source: string,
  target: string,
  targetHandle: string,
): Connection => {
  const connection: Connection = {
    source,
    target,
    sourceHandle: "output",
    targetHandle,
  };
  adapter.addConnection(connection);
  return connection;
};

const removeNode = (adapter: CoreGraphAdapter, nodeId: string): void => {
  const change: NodeRemoveChange = {
    id: nodeId,
    type: "remove",
  };
  const changes: NodeChange[] = [change];
  adapter.changeNodes(changes);
};

const removeEdge = (
  adapter: CoreGraphAdapter,
  source: string,
  target: string,
  targetHandle: string,
  edges: Edge[],
): void => {
  const change: EdgeRemoveChange = {
    id: getReactFlowEdgeId(source, target, targetHandle),
    type: "remove",
  };
  const changes: EdgeChange[] = [change];
  adapter.changeEdges(changes, edges);
};

const buildReactFlowEdges = (
  items: Array<[string, string, string]>,
): Edge[] => {
  return items.map((item) => {
    const [source, target, targetHandle] = item;
    return {
      id: getReactFlowEdgeId(source, target, targetHandle),
      source,
      target,
      targetHandle,
    };
  });
};

const getReactFlowEdgeId = (
  source: string,
  target: string,
  targetHandle: string,
): string => {
  return `reactflow__edge-${source}output-${target}${targetHandle}`;
};
