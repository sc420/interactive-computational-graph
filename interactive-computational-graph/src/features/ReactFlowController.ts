import {
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type XYPosition,
} from "reactflow";
import type AddNodeData from "./AddNodeData";
import { findFeatureOperation } from "./ControllerUtilities";
import type NodeData from "./NodeData";
import { randomInteger } from "./RandomUtilities";
import type SelectedFeature from "./SelectedFeature";

const addReactFlowNode = (
  addNodeData: AddNodeData,
  position: XYPosition,
  nodes: Node[],
): Node[] => {
  const node: Node = {
    id: addNodeData.nodeId,
    type: "custom", // registered in Graph
    data: buildReactFlowNodeData(addNodeData),
    dragHandle: ".drag-handle", // corresponds to className in NoteTitle
    selected: true,
    position,
  };
  return nodes.concat(node);
};

const getNewReactFlowNodePosition = (
  nodes: Node[],
  lastSelectedNodeId: string | null,
): XYPosition => {
  const randomMin = -50;
  const randomMax = 50;
  let referenceNode = findLastSelectedNode(nodes, lastSelectedNodeId);

  // Pick a random node. For this case, pick any node that has id since the
  // array may contain undefined value
  if (referenceNode === null) {
    referenceNode = nodes.find((node) => "id" in node) ?? null;
  }

  if (referenceNode !== null) {
    return {
      x: referenceNode.position.x + randomInteger(randomMin, randomMax),
      y: referenceNode.position.y + randomInteger(randomMin, randomMax),
    };
  } else {
    return {
      x: randomInteger(0, randomMax),
      y: randomInteger(0, randomMax),
    };
  }
};

const updateReactFlowNodeInputValue = (
  nodeId: string,
  inputPortId: string,
  value: string,
  nodes: Node[],
): Node[] => {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      const data = node.data as NodeData;
      const inputItem = data.inputItems.find(
        (inputItem) => inputItem.id === inputPortId,
      );
      if (inputItem === undefined) {
        throw new Error(`Should find input port ${inputPortId}`);
      }
      inputItem.value = value;
      // Set the new data to notify React Flow about the change
      const newData: NodeData = { ...node.data };
      node.data = newData;
    }

    return node;
  });
};

const hideInputField = (connection: Connection, nodes: Node[]): Node[] => {
  const targetHandle = connection.targetHandle;
  if (targetHandle === null) {
    throw new Error("Should have target handle");
  }

  return nodes.map((node) => {
    if (node.id === connection.target) {
      const data = node.data as NodeData;
      const inputItem = data.inputItems.find(
        (inputItem) => inputItem.id === connection.targetHandle,
      );
      if (inputItem === undefined) {
        throw new Error(`Should find input port ${targetHandle}`);
      }
      inputItem.showInputField = false;
      // Set the new data to notify React Flow about the change
      const newData: NodeData = { ...node.data };
      node.data = newData;
    }

    return node;
  });
};

const showInputFields = (edges: Edge[], nodes: Node[]): Node[] => {
  return nodes.map((node) => {
    edges.forEach((edge) => {
      if (typeof edge.targetHandle !== "string") {
        return;
      }
      if (edge.target !== node.id) {
        return;
      }

      const data = node.data as NodeData;
      const inputItem = data.inputItems.find(
        (inputItem) => inputItem.id === edge.targetHandle,
      );
      if (inputItem === undefined) {
        throw new Error(`Should find input port ${edge.targetHandle}`);
      }
      inputItem.showInputField = true;
      // Set the new data to notify React Flow about the change
      const newData: NodeData = { ...node.data };
      node.data = newData;
    });

    return node;
  });
};

const findRemovedEdges = (changes: EdgeChange[], edges: Edge[]): Edge[] => {
  const removedEdgeIds = new Set<string>();
  changes.forEach((change) => {
    switch (change.type) {
      case "remove": {
        removedEdgeIds.add(change.id);
        break;
      }
    }
  });

  const removedEdges: Edge[] = [];
  edges.forEach((edge) => {
    if (removedEdgeIds.has(edge.id)) {
      removedEdges.push(edge);
    }
  });
  return removedEdges;
};

const updateEdgeAnimations = (
  selectedFeature: SelectedFeature | null,
  isReverseMode: boolean,
  hasDerivativeTarget: boolean,
  selectedNodeIds: string[],
  edges: Edge[],
): Edge[] => {
  const nodeIds = new Set<string>();
  selectedNodeIds.forEach((selectedNodeId) => {
    nodeIds.add(selectedNodeId);
  });

  return edges.map((edge) => {
    edge.animated = false;
    if (selectedFeature === "explain-derivatives" && hasDerivativeTarget) {
      if (isReverseMode && nodeIds.has(edge.source)) {
        edge.animated = true;
      } else if (!isReverseMode && nodeIds.has(edge.target)) {
        edge.animated = true;
      }
    }
    return edge;
  });
};

const updateReactFlowNodeFValues = (
  updatedNodeIdToValues: Map<string, string>,
  nodes: Node[],
): Node[] => {
  return nodes.map((node) => {
    if (updatedNodeIdToValues.has(node.id)) {
      const value = updatedNodeIdToValues.get(node.id);
      if (value === undefined) {
        throw new Error(`Should find the value of node ${node.id}`);
      }

      const data = node.data as NodeData;
      const outputItem = data.outputItems.find(
        (outputItem) => outputItem.type === "VALUE",
      );
      if (outputItem !== undefined) {
        outputItem.value = value;
        // Set the new data to notify React Flow about the change
        const newData: NodeData = { ...node.data };
        node.data = newData;
      }
    }

    return node;
  });
};

const updateReactFlowNodeDerivatives = (
  updatedNodeIdToDerivatives: Map<string, string>,
  isReverseMode: boolean,
  derivativeTarget: string | null,
  nodes: Node[],
): Node[] => {
  return nodes.map((node) => {
    if (updatedNodeIdToDerivatives.has(node.id)) {
      const value = updatedNodeIdToDerivatives.get(node.id);
      if (value === undefined) {
        throw new Error(`Should find the value of node ${node.id}`);
      }

      const data = node.data as NodeData;
      const outputItem = data.outputItems.find(
        (outputItem) => outputItem.type === "DERIVATIVE",
      );
      if (outputItem !== undefined) {
        const derivativeText = buildDerivativeText(
          node.id,
          isReverseMode,
          derivativeTarget,
        );
        outputItem.text = `${derivativeText} =`;
        outputItem.value = value;
        // Set the new data to notify React Flow about the change
        const newData: NodeData = { ...node.data };
        node.data = newData;
      }
    }

    return node;
  });
};

const updateReactFlowNodeDarkMode = (
  isDarkMode: boolean,
  nodes: Node[],
): Node[] => {
  return nodes.map((node) => {
    const data = node.data as NodeData;
    data.isDarkMode = isDarkMode;
    // Set the new data to notify React Flow about the change
    const newData: NodeData = { ...node.data };
    node.data = newData;
    return node;
  });
};

const updateReactFlowNodeHighlighted = (
  selectedFeature: SelectedFeature | null,
  derivativeTarget: string | null,
  nodes: Node[],
): Node[] => {
  return nodes.map((node) => {
    const data = node.data as NodeData;
    data.isHighlighted =
      selectedFeature === "explain-derivatives" && node.id === derivativeTarget;
    // Set the new data to notify React Flow about the change
    const newData: NodeData = { ...node.data };
    node.data = newData;
    return node;
  });
};

const getLastSelectedNodeId = (nodes: Node[]): string | null => {
  const firstNode = nodes.find((node) => "id" in node) ?? null;
  if (firstNode === null) {
    return null;
  }
  return firstNode.id;
};

const selectReactFlowNode = (nodeId: string, nodes: Node[]): Node[] => {
  return nodes.map((node) => {
    if (node.id !== nodeId) {
      node.selected = false;
      return node;
    }

    node.selected = true;
    return node;
  });
};

const deselectAllNodes = (nodes: Node[]): Node[] => {
  return nodes.map((node) => {
    node.selected = false;
    return node;
  });
};

const buildReactFlowNodeData = (addNodeData: AddNodeData): NodeData => {
  const {
    featureNodeType,
    nodeId,
    featureOperations,
    isReverseMode,
    derivativeTarget,
    onInputChange,
    onBodyClick,
    isDarkMode,
  } = addNodeData;
  const isHighlighted = false;

  switch (featureNodeType.nodeType) {
    case "CONSTANT": {
      return {
        text: `c${nodeId}`,
        featureNodeType,
        inputItems: [
          {
            id: "value",
            text: "=",
            showHandle: false,
            showInputField: true,
            value: "0",
          },
        ],
        outputItems: [],
        onBodyClick,
        onInputChange,
        isDarkMode,
        isHighlighted,
      };
    }
    case "VARIABLE": {
      const derivativeText = buildDerivativeText(
        nodeId,
        isReverseMode,
        derivativeTarget,
      );
      return {
        text: `v${nodeId}`,
        featureNodeType,
        inputItems: [
          {
            id: "value",
            text: "=",
            showHandle: false,
            showInputField: true,
            value: "0",
          },
        ],
        outputItems: [
          {
            type: "DERIVATIVE",
            text: `${derivativeText} =`,
            value: "0",
          },
        ],
        onBodyClick,
        onInputChange,
        isDarkMode,
        isHighlighted,
      };
    }
    case "OPERATION": {
      const featureOperation = findFeatureOperation(
        featureNodeType.operationId,
        featureOperations,
      );

      const derivativeText = buildDerivativeText(
        nodeId,
        isReverseMode,
        derivativeTarget,
      );
      return {
        text: `${featureOperation.id}${nodeId}`,
        featureNodeType,
        inputItems: featureOperation.inputPorts.map((inputPort) => {
          return {
            id: inputPort.getId(),
            text: inputPort.getId(),
            showHandle: true,
            showInputField: true,
            value: "0",
          };
        }),
        outputItems: [
          {
            type: "VALUE",
            text: "=",
            value: "0",
          },
          {
            type: "DERIVATIVE",
            text: `${derivativeText} =`,
            value: "0",
          },
        ],
        onBodyClick,
        onInputChange,
        isDarkMode,
        isHighlighted,
      };
    }
  }
};

const buildDerivativeText = (
  nodeId: string,
  isReverseMode: boolean,
  derivativeTarget: string | null,
): string => {
  if (isReverseMode) {
    return `d(${derivativeTarget ?? "?"})/d(${nodeId})`;
  } else {
    return `d(${nodeId})/d(${derivativeTarget ?? "?"})`;
  }
};

const findLastSelectedNode = (
  nodes: Node[],
  lastSelectedNodeId: string | null,
): Node | null => {
  if (lastSelectedNodeId === null) {
    return null;
  }
  return nodes.find((node) => node.id === lastSelectedNodeId) ?? null;
};

export {
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
};
