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

    addConstantNode(adapter, "1", "c_1");

    const expectedNodeIdToFValues = new Map<string, string>([["1", "0"]]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["1", "0"],
    ]);
    const expectedNodeIdToNames = new Map<string, string>([["1", "c_1"]]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
      expectedNodeIdToNames,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit events when adding connection successfully", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");

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

    const connection = addConnection(adapter, "1", "2", "a");

    expect(handleConnectionAdded).toHaveBeenCalledWith(connection);
    expect(handleHideInputField).toHaveBeenCalledWith(connection);
    const expectedNodeIdToFValues = new Map<string, string>([
      ["1", "0"],
      ["2", "0"],
      ["dummy-input-node-2-a", "0"],
      ["dummy-input-node-2-b", "0"],
    ]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["1", "0"],
      ["2", "0"],
      ["dummy-input-node-2-a", "0"],
      ["dummy-input-node-2-b", "0"],
    ]);
    const expectedNodeIdToNames = new Map<string, string>([
      ["1", "c_1"],
      ["2", "a_1"],
      ["dummy-input-node-2-a", "a_1.a"],
      ["dummy-input-node-2-b", "a_1.b"],
    ]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
      expectedNodeIdToNames,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit events when there's error when adding connection", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "1", "a_1");

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

    addConnection(adapter, "1", "1", "a");

    expect(handleConnectionAdded).not.toHaveBeenCalled();
    expect(handleConnectionError).toHaveBeenCalledWith(
      new Error("Connecting node a_1 to node a_1 would cause a cycle"),
    );
    expect(handleHideInputField).not.toHaveBeenCalled();
    expect(handleFValuesUpdated).not.toHaveBeenCalled();
    expect(handleDerivativeValuesUpdated).not.toHaveBeenCalled();
    expect(handleExplainDerivativeDataUpdated).not.toHaveBeenCalled();
  });

  test("should emit output updates when setting differentiation mode", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    adapter.setDifferentiationMode("FORWARD");

    const expectedNodeIdToFValues = new Map<string, string>([["1", "0"]]);
    const expectedDifferentiationMode: DifferentiationMode = "FORWARD";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["1", "0"],
    ]);
    const expectedNodeIdToNames = new Map<string, string>([["1", "c_1"]]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
      expectedNodeIdToNames,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit output updates when setting target node", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    adapter.setTargetNode("1");

    const expectedNodeIdToFValues = new Map<string, string>([["1", "0"]]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = "c_1";
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["1", "0"],
    ]);
    const expectedNodeIdToNames = new Map<string, string>([["1", "c_1"]]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
      expectedNodeIdToNames,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit events when updating node name", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");

    const handleNodeNameUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onNodeNameUpdated(handleNodeNameUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    adapter.updateNodeNameById("1", "c_2");

    expect(handleNodeNameUpdated).toHaveBeenCalledWith("1", "c_2");
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit output updates when updating node value", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "1", "a_1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    adapter.updateNodeValueById("1", "a", "1");

    const expectedNodeIdToFValues = new Map<string, string>([
      ["1", "1"],
      ["dummy-input-node-1-a", "1"],
      ["dummy-input-node-1-b", "0"],
    ]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["1", "0"],
      ["dummy-input-node-1-a", "0"],
      ["dummy-input-node-1-b", "0"],
    ]);
    const expectedNodeIdToNames = new Map<string, string>([
      ["1", "a_1"],
      ["dummy-input-node-1-a", "a_1.a"],
      ["dummy-input-node-1-b", "a_1.b"],
    ]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
      expectedNodeIdToNames,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit output updates when removing the node", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "1", "a_1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    removeNode(adapter, "1");

    const expectedNodeIdToFValues = new Map<string, string>([]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([]);
    const expectedNodeIdToNames = new Map<string, string>([]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
      expectedNodeIdToNames,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should emit target node update when removing the target node", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "1", "a_1");
    adapter.setTargetNode("1");

    const handleTargetNodeUpdated = jest.fn();

    adapter.onTargetNodeUpdated(handleTargetNodeUpdated);

    removeNode(adapter, "1");

    expect(handleTargetNodeUpdated).toHaveBeenCalledWith(null);
  });

  test("should not emit output updates when doing other node changes", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "1", "a_1");

    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    const change: NodePositionChange = {
      id: "1",
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

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");
    addConnection(adapter, "1", "2", "a");

    const handleShowInputFields = jest.fn();
    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onShowInputFields(handleShowInputFields);
    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    const edges = buildReactFlowEdges([["1", "2", "a"]]);
    removeEdge(adapter, "1", "2", "a", edges);

    expect(handleShowInputFields).toHaveBeenCalledWith(edges);
    const expectedNodeIdToFValues = new Map<string, string>([
      ["1", "0"],
      ["2", "0"],
      ["dummy-input-node-2-a", "0"],
      ["dummy-input-node-2-b", "0"],
    ]);
    const expectedDifferentiationMode: DifferentiationMode = "REVERSE";
    const expectedTargetNode = null;
    const expectedNodeIdToDerivativeValues = new Map<string, string>([
      ["1", "0"],
      ["2", "0"],
      ["dummy-input-node-2-a", "0"],
      ["dummy-input-node-2-b", "0"],
    ]);
    const expectedNodeIdToNames = new Map<string, string>([
      ["1", "c_1"],
      ["2", "a_1"],
      ["dummy-input-node-2-a", "a_1.a"],
      ["dummy-input-node-2-b", "a_1.b"],
    ]);
    expect(handleFValuesUpdated).toHaveBeenCalledWith(expectedNodeIdToFValues);
    expect(handleDerivativeValuesUpdated).toHaveBeenCalledWith(
      expectedDifferentiationMode,
      expectedTargetNode,
      expectedNodeIdToDerivativeValues,
      expectedNodeIdToNames,
    );
    expect(handleExplainDerivativeDataUpdated).toHaveBeenCalledWith([]);
  });

  test("should not emit events when doing other connection changes", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");
    addConnection(adapter, "1", "2", "a");

    const handleShowInputFields = jest.fn();
    const handleFValuesUpdated = jest.fn();
    const handleDerivativeValuesUpdated = jest.fn();
    const handleExplainDerivativeDataUpdated = jest.fn();

    adapter.onShowInputFields(handleShowInputFields);
    adapter.onFValuesUpdated(handleFValuesUpdated);
    adapter.onDerivativeValuesUpdated(handleDerivativeValuesUpdated);
    adapter.onExplainDerivativeDataUpdated(handleExplainDerivativeDataUpdated);

    const change: EdgeSelectionChange = {
      id: getReactFlowEdgeId("1", "2", "a"),
      type: "select",
      selected: true,
    };
    const changes: EdgeChange[] = [change];
    const edges = buildReactFlowEdges([["1", "2", "a"]]);
    adapter.changeEdges(changes, edges);

    expect(handleShowInputFields).not.toHaveBeenCalled();
    expect(handleFValuesUpdated).not.toHaveBeenCalled();
    expect(handleDerivativeValuesUpdated).not.toHaveBeenCalled();
    expect(handleExplainDerivativeDataUpdated).not.toHaveBeenCalled();
  });

  test("should emit non-empty explain derivative data when selecting nodes", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    adapter.setTargetNode("1");

    const explainDerivativeDataUpdated = jest.fn();

    adapter.onExplainDerivativeDataUpdated(explainDerivativeDataUpdated);

    adapter.updateSelectedNodeIds(["1"]);

    const firstCallArgs = explainDerivativeDataUpdated.mock.calls[0];
    const data = firstCallArgs[0];
    expect(data).toHaveLength(1);
  });

  test("should emit empty explain derivative data when selecting nodes with null target node", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");

    const explainDerivativeDataUpdated = jest.fn();

    adapter.onExplainDerivativeDataUpdated(explainDerivativeDataUpdated);

    adapter.updateSelectedNodeIds(["1"]);

    const expectedData: ExplainDerivativeData[] = [];
    expect(explainDerivativeDataUpdated).toHaveBeenCalledWith(expectedData);
  });
});

describe("behavior", () => {
  test("should not throw error when the current selected node is removed", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");
    addConnection(adapter, "1", "2", "a");

    adapter.setTargetNode("1");
    adapter.updateSelectedNodeIds(["1"]);

    const edges = buildReactFlowEdges([["1", "2", "a"]]);
    // Should remove edge first
    removeEdge(adapter, "1", "2", "a", edges);
    // Should remove node later
    removeNode(adapter, "1");
  });

  test("should update the node name", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");

    expect(adapter.getNodeNameById("1")).toBe("c_1");

    adapter.updateNodeNameById("1", "C");

    expect(adapter.getNodeNameById("1")).toBe("C");
  });

  test("should rename dummy input nodes when the associated node is renamed", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "1", "a_1");

    expect(adapter.getNodeNameById("dummy-input-node-1-a")).toBe("a_1.a");
    expect(adapter.getNodeNameById("dummy-input-node-1-b")).toBe("a_1.b");

    adapter.updateNodeNameById("1", "x");

    expect(adapter.getNodeNameById("dummy-input-node-1-a")).toBe("x.a");
    expect(adapter.getNodeNameById("dummy-input-node-1-b")).toBe("x.b");
  });

  test("should get a list of visible node names without dummy input nodes", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");
    addConnection(adapter, "1", "2", "a");

    const expectedNodeNames: string[] = ["c_1", "a_1"];
    expect(adapter.getVisibleNodeNames().sort()).toEqual(
      expectedNodeNames.sort(),
    );
  });

  test("should get the visible node ID by the visible node ID", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");

    expect(adapter.getVisibleNodeIdById("1")).toBe("1");
  });

  test("should get the visible node ID by the dummy input node ID", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "1", "a_1");

    expect(adapter.getVisibleNodeIdById("dummy-input-node-1-a")).toBe("1");
    expect(adapter.getVisibleNodeIdById("dummy-input-node-1-b")).toBe("1");
  });

  test("should throw error when getting the visible node ID by the removed dummy input node ID", () => {
    const adapter = new CoreGraphAdapter();

    addAddNode(adapter, "1", "a_1");

    removeNode(adapter, "1");

    expect(() => {
      adapter.getVisibleNodeIdById("dummy-input-node-1-a");
    }).toThrow();
    expect(() => {
      adapter.getVisibleNodeIdById("dummy-input-node-1-b");
    }).toThrow();
  });

  test("should get a list of visible node IDs", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");

    const expectedNodeIds: string[] = ["1", "2"];
    expect(adapter.getVisibleNodeIds().sort()).toEqual(expectedNodeIds.sort());
  });

  test("should get the node name by ID", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");

    expect(adapter.getNodeNameById("1")).toBe("c_1");
    expect(adapter.getNodeNameById("2")).toBe("a_1");
  });

  test("should throw error when getting the node name of the removed ID", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");
    removeNode(adapter, "1");

    expect(() => {
      adapter.getNodeNameById("1");
    }).toThrow();
  });

  test("should save the state", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");
    addConnection(adapter, "1", "2", "a");

    const state = adapter.save();
    expect(state).toEqual(
      expect.objectContaining({
        nodeIdToNames: {
          "1": "c_1",
          "2": "a_1",
          "dummy-input-node-2-a": "a_1.a",
          "dummy-input-node-2-b": "a_1.b",
        },
        dummyInputNodeIdToNodeIds: {
          "dummy-input-node-2-a": "2",
          "dummy-input-node-2-b": "2",
        },
      }),
    );
  });

  test("should load from the saved state correctly", () => {
    const adapter = new CoreGraphAdapter();

    addConstantNode(adapter, "1", "c_1");
    addAddNode(adapter, "2", "a_1");
    addConnection(adapter, "1", "2", "a");

    const state = adapter.save();
    adapter.load(state, [featureOperation]);

    expect(adapter.getNodeNameById("1")).toBe("c_1");
    expect(adapter.getNodeNameById("2")).toBe("a_1");
  });
});

const featureOperation: FeatureOperation = {
  id: "add",
  name: "Add",
  type: "basic",
  namePrefix: "a",
  operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
  inputPorts: [new Port("a", false), new Port("b", false)],
  helpText: "Add two numbers $ a + b $",
};

const addConstantNode = (
  adapter: CoreGraphAdapter,
  nodeId: string,
  nodeName: string,
): void => {
  const featureType: FeatureNodeType = { nodeType: "CONSTANT" };
  adapter.addNode(featureType, featureOperation, nodeId, nodeName);
};

const addAddNode = (
  adapter: CoreGraphAdapter,
  nodeId: string,
  nodeName: string,
): void => {
  const featureType: FeatureNodeType = {
    nodeType: "OPERATION",
    operationId: "add",
  };
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
