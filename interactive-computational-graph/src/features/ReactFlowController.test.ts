import {
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type OnSelectionChangeParams,
  type XYPosition,
} from "reactflow";
import Operation from "../core/Operation";
import Port from "../core/Port";
import type AddNodeData from "./AddNodeData";
import { ADD_DFDX_CODE, ADD_F_CODE } from "./BuiltInCode";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";
import {
  addReactFlowNode,
  deselectAllNodes,
  findRemovedEdges,
  getLastSelectedNodeId,
  getNewReactFlowNodePosition,
  hideInputField,
  selectReactFlowNode,
  showInputFields,
  updateEdgeAnimations,
  updateReactFlowNodeDarkMode,
  updateReactFlowNodeDerivatives,
  updateReactFlowNodeFValues,
  updateReactFlowNodeHighlighted,
  updateReactFlowNodeInputValue,
  updateReactFlowNodeName,
} from "./ReactFlowController";
import type SelectedFeature from "./SelectedFeature";

jest.mock("../features/RandomUtilities");

test("should add node", () => {
  const featureNodeType: FeatureNodeType = { nodeType: "VARIABLE" };
  const addNodeData: AddNodeData = {
    featureNodeType,
    featureOperation: getFeatureOperation(),
    nodeId: "0",
    nodeName: "a_1",
    initialOutputValue: "0",
    isReverseMode: true,
    derivativeTargetName: null,
    onNameChange: jest.fn(),
    onInputChange: jest.fn(),
    onBodyClick: jest.fn(),
    onDerivativeClick: jest.fn(),
    isDarkMode: false,
  };
  const position = getDummyPosition();
  const nodes: Node[] = [];
  const newNodes = addReactFlowNode(addNodeData, position, nodes);

  expect(newNodes).toHaveLength(1);
  expect(newNodes[0]).toMatchObject({
    id: "0",
    type: "custom",
    dragHandle: ".drag-handle",
    selected: true,
    position,
  });
});

test("should get random position when there're no reference nodes", () => {
  const nodes: Node[] = [];
  const lastSelectedNodeId = null;
  const newPosition = getNewReactFlowNodePosition(nodes, lastSelectedNodeId);

  expect(newPosition).toEqual({
    x: 100,
    y: 100,
  });
});

test("should get random offset position when there're reference nodes", () => {
  const nodes: Node[] = [
    {
      id: "0",
      position: {
        x: 1000,
        y: 1000,
      },
      data: {},
    },
  ];
  const lastSelectedNodeId = "0";
  const newPosition = getNewReactFlowNodePosition(nodes, lastSelectedNodeId);

  expect(newPosition).toEqual({
    x: 1100,
    y: 1100,
  });
});

test("should update the node name", () => {
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        name: "a_1",
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        name: "a_2",
      },
    },
  ];
  const nodeId = "1";
  const name = "b_1";
  const updatedNodes = updateReactFlowNodeName(nodeId, name, nodes);

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        name: "a_1",
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        name: "b_1",
      },
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

test("should update the node input value", () => {
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", value: "0" },
          { id: "b", value: "0" },
        ],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", value: "0" },
          { id: "b", value: "0" },
        ],
      },
    },
  ];
  const nodeId = "1";
  const inputPortId = "a";
  const value = "123";
  const updatedNodes = updateReactFlowNodeInputValue(
    nodeId,
    inputPortId,
    value,
    nodes,
  );

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", value: "0" },
          { id: "b", value: "0" },
        ],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", value: "123" },
          { id: "b", value: "0" },
        ],
      },
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

test("should hide the input field", () => {
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", showInputField: true },
          { id: "b", showInputField: true },
        ],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", showInputField: true },
          { id: "b", showInputField: true },
        ],
      },
    },
  ];
  const connection: Connection = {
    source: "0",
    target: "1",
    sourceHandle: "output",
    targetHandle: "a",
  };
  const updatedNodes = hideInputField(connection, nodes);

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", showInputField: true },
          { id: "b", showInputField: true },
        ],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", showInputField: false },
          { id: "b", showInputField: true },
        ],
      },
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

test("should show the input fields", () => {
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", showInputField: true },
          { id: "b", showInputField: true },
        ],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", showInputField: false },
          { id: "b", showInputField: false },
        ],
      },
    },
  ];
  const edges: Edge[] = [
    { id: "edge-1", source: "0", target: "1", targetHandle: "a" },
    { id: "edge-2", source: "0", target: "1", targetHandle: "b" },
  ];
  const updatedNodes = showInputFields(edges, nodes);

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", showInputField: true },
          { id: "b", showInputField: true },
        ],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        inputItems: [
          { id: "a", showInputField: true },
          { id: "b", showInputField: true },
        ],
      },
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

test("should find the removed edges from changes", () => {
  const changes: EdgeChange[] = [
    { id: "edge-1", type: "remove" },
    { id: "edge-3", type: "remove" },
  ];
  const edges: Edge[] = [
    { id: "edge-1", source: "0", target: "1", targetHandle: "a" },
    { id: "edge-2", source: "0", target: "1", targetHandle: "b" },
    { id: "edge-3", source: "0", target: "2", targetHandle: "a" },
  ];
  const removedEdges = findRemovedEdges(changes, edges);

  expect(removedEdges).toEqual([edges[0], edges[2]]);
});

test("should update edge animations for reverse mode", () => {
  const selectedFeature: SelectedFeature | null = "explain-derivatives";
  const isReverseMode = true;
  const hasDerivativeTarget = true;
  const selectedNodeIds: string[] = ["1"];
  const edges: Edge[] = [
    {
      id: "edge-1",
      source: "0",
      target: "1",
      targetHandle: "a",
      animated: false,
    },
    {
      id: "edge-2",
      source: "0",
      target: "1",
      targetHandle: "b",
      animated: false,
    },
    {
      id: "edge-3",
      source: "1",
      target: "2",
      targetHandle: "a",
      animated: false,
    },
    {
      id: "edge-4",
      source: "1",
      target: "2",
      targetHandle: "b",
      animated: false,
    },
  ];
  const updatedEdges = updateEdgeAnimations(
    selectedFeature,
    isReverseMode,
    hasDerivativeTarget,
    selectedNodeIds,
    edges,
  );

  const expectedEdges: Edge[] = [
    {
      id: "edge-1",
      source: "0",
      target: "1",
      targetHandle: "a",
      animated: false,
    },
    {
      id: "edge-2",
      source: "0",
      target: "1",
      targetHandle: "b",
      animated: false,
    },
    {
      id: "edge-3",
      source: "1",
      target: "2",
      targetHandle: "a",
      animated: true,
    },
    {
      id: "edge-4",
      source: "1",
      target: "2",
      targetHandle: "b",
      animated: true,
    },
  ];
  expect(updatedEdges).toEqual(expectedEdges);
});

test("should update edge animations for forward mode", () => {
  const selectedFeature: SelectedFeature | null = "explain-derivatives";
  const isReverseMode = false;
  const hasDerivativeTarget = true;
  const selectedNodeIds: string[] = ["1"];
  const edges: Edge[] = [
    {
      id: "edge-1",
      source: "0",
      target: "1",
      targetHandle: "a",
      animated: false,
    },
    {
      id: "edge-2",
      source: "0",
      target: "1",
      targetHandle: "b",
      animated: false,
    },
    {
      id: "edge-3",
      source: "1",
      target: "2",
      targetHandle: "a",
      animated: false,
    },
    {
      id: "edge-4",
      source: "1",
      target: "2",
      targetHandle: "b",
      animated: false,
    },
  ];
  const updatedEdges = updateEdgeAnimations(
    selectedFeature,
    isReverseMode,
    hasDerivativeTarget,
    selectedNodeIds,
    edges,
  );

  const expectedEdges: Edge[] = [
    {
      id: "edge-1",
      source: "0",
      target: "1",
      targetHandle: "a",
      animated: true,
    },
    {
      id: "edge-2",
      source: "0",
      target: "1",
      targetHandle: "b",
      animated: true,
    },
    {
      id: "edge-3",
      source: "1",
      target: "2",
      targetHandle: "a",
      animated: false,
    },
    {
      id: "edge-4",
      source: "1",
      target: "2",
      targetHandle: "b",
      animated: false,
    },
  ];
  expect(updatedEdges).toEqual(expectedEdges);
});

test("should not update edge animations when feature is not selected", () => {
  const selectedFeature: SelectedFeature | null = null;
  const isReverseMode = false;
  const hasDerivativeTarget = true;
  const selectedNodeIds: string[] = ["1"];
  const edges: Edge[] = [
    {
      id: "edge-1",
      source: "0",
      target: "1",
      targetHandle: "a",
      animated: false,
    },
  ];
  const updatedEdges = updateEdgeAnimations(
    selectedFeature,
    isReverseMode,
    hasDerivativeTarget,
    selectedNodeIds,
    edges,
  );

  const expectedEdges: Edge[] = [
    {
      id: "edge-1",
      source: "0",
      target: "1",
      targetHandle: "a",
      animated: false,
    },
  ];
  expect(updatedEdges).toEqual(expectedEdges);
});

test("should not update edge animations when there's no derivative target", () => {
  const selectedFeature: SelectedFeature | null = "explain-derivatives";
  const isReverseMode = false;
  const hasDerivativeTarget = false;
  const selectedNodeIds: string[] = ["1"];
  const edges: Edge[] = [
    {
      id: "edge-1",
      source: "0",
      target: "1",
      targetHandle: "a",
      animated: false,
    },
  ];
  const updatedEdges = updateEdgeAnimations(
    selectedFeature,
    isReverseMode,
    hasDerivativeTarget,
    selectedNodeIds,
    edges,
  );

  const expectedEdges: Edge[] = [
    {
      id: "edge-1",
      source: "0",
      target: "1",
      targetHandle: "a",
      animated: false,
    },
  ];
  expect(updatedEdges).toEqual(expectedEdges);
});

test("should update node f values", () => {
  const updatedNodeIdToValues = new Map<string, string>([
    ["0", "123"],
    ["2", "456"],
  ]);
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "VALUE", value: "0" }],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "VALUE", value: "0" }],
      },
    },
    {
      id: "2",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "VALUE", value: "0" }],
      },
    },
  ];
  const updatedNodes = updateReactFlowNodeFValues(updatedNodeIdToValues, nodes);

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "VALUE", value: "123" }],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "VALUE", value: "0" }],
      },
    },
    {
      id: "2",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "VALUE", value: "456" }],
      },
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

test("should update node derivative values", () => {
  const updatedNodeIdToDerivatives: ReadonlyMap<string, string> = new Map([
    ["0", "1"],
    ["2", "2"],
  ]);
  const updatedNodeIdToNames: ReadonlyMap<string, string> = new Map([
    ["0", "f_0"],
    ["2", "f_2"],
  ]);
  const isReverseMode = true;
  const derivativeTargetName = "g";
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "DERIVATIVE", value: "0" }],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "DERIVATIVE", value: "0" }],
      },
    },
    {
      id: "2",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "DERIVATIVE", value: "0" }],
      },
    },
  ];
  const updatedNodes = updateReactFlowNodeDerivatives(
    updatedNodeIdToDerivatives,
    updatedNodeIdToNames,
    isReverseMode,
    derivativeTargetName,
    nodes,
  );

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        outputItems: [
          {
            type: "DERIVATIVE",
            value: "1",
            labelParts: [
              {
                type: "latexLink",
                id: "derivative",
                latex: "\\displaystyle \\frac{\\partial{g}}{\\partial{f_0}}",
                href: "0",
              },
              {
                type: "latex",
                id: "equal",
                latex: "=",
              },
            ],
          },
        ],
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        outputItems: [{ type: "DERIVATIVE", value: "0" }],
      },
    },
    {
      id: "2",
      position: getDummyPosition(),
      data: {
        outputItems: [
          {
            type: "DERIVATIVE",
            value: "2",
            labelParts: [
              {
                type: "latexLink",
                id: "derivative",
                latex: "\\displaystyle \\frac{\\partial{g}}{\\partial{f_2}}",
                href: "2",
              },
              {
                type: "latex",
                id: "equal",
                latex: "=",
              },
            ],
          },
        ],
      },
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

test("should update nodes dark mode", () => {
  const isDarkMode = true;
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        isDarkMode: false,
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        isDarkMode: true,
      },
    },
  ];
  const updatedNodes = updateReactFlowNodeDarkMode(isDarkMode, nodes);

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        isDarkMode: true,
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        isDarkMode: true,
      },
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

test("should highlight the derivative target node", () => {
  const derivativeTarget: string | null = "0";
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        isHighlighted: false,
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        isHighlighted: true,
      },
    },
  ];
  const updatedNodes = updateReactFlowNodeHighlighted(derivativeTarget, nodes);

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {
        isHighlighted: true,
      },
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {
        isHighlighted: false,
      },
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

test("should get the last selected node", () => {
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {},
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {},
    },
  ];
  const edges: Edge[] = [];
  const params: OnSelectionChangeParams = {
    nodes,
    edges,
  };
  const nodeId = getLastSelectedNodeId(params);

  expect(nodeId).toBe("0");
});

test("should select the node", () => {
  const nodeId = "1";
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {},
      selected: true,
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {},
      selected: false,
    },
  ];
  const updatedNodes = selectReactFlowNode(nodeId, nodes);

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {},
      selected: false,
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {},
      selected: true,
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

test("should deselect all nodes", () => {
  const nodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {},
      selected: true,
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {},
      selected: false,
    },
  ];
  const updatedNodes = deselectAllNodes(nodes);

  const expectedNodes: Node[] = [
    {
      id: "0",
      position: getDummyPosition(),
      data: {},
      selected: false,
    },
    {
      id: "1",
      position: getDummyPosition(),
      data: {},
      selected: false,
    },
  ];
  expect(updatedNodes).toEqual(expectedNodes);
});

const getFeatureOperation = (): FeatureOperation => {
  return {
    id: "add",
    text: "Add",
    type: "basic",
    namePrefix: "a",
    operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
    inputPorts: [new Port("a", false), new Port("b", false)],
    helpText: "Add two numbers $ a + b $",
  };
};

const getDummyPosition = (): XYPosition => {
  return { x: 0, y: 0 };
};
