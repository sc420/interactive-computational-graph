import {
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type XYPosition,
} from "reactflow";
import { findFeatureOperation } from "./ControllerUtilities";
import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";
import type NodeData from "./NodeData";
import type NonEmptyConnection from "./NonEmptyConnection";
import { randomInteger } from "./RandomUtilities";

type InputChangeCallback = (
  nodeId: string,
  inputPortId: string,
  value: string,
) => void;

type BodyClickCallback = (nodeId: string) => void;

const addReactFlowNode = (
  featureNodeType: FeatureNodeType,
  nodeId: string,
  featureOperations: FeatureOperation[],
  isReverseMode: boolean,
  derivativeTarget: string | null,
  onInputChange: InputChangeCallback,
  onBodyClick: BodyClickCallback,
  position: XYPosition,
  nodes: Node[],
): Node[] => {
  const node: Node = {
    id: nodeId,
    type: "custom", // registered in Graph
    data: buildReactFlowNodeData(
      featureNodeType,
      nodeId,
      featureOperations,
      isReverseMode,
      derivativeTarget,
      onInputChange,
      onBodyClick,
    ),
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

const showInputFields = (
  nodeIdToEmptyInputPortIds: Map<string, string>,
  nodes: Node[],
): Node[] => {
  return nodes.map((node) => {
    if (nodeIdToEmptyInputPortIds.has(node.id)) {
      const targetHandle = nodeIdToEmptyInputPortIds.get(node.id);
      if (targetHandle === undefined) {
        throw new Error(`Should find the target handle of node ${node.id}`);
      }

      const data = node.data as NodeData;
      const inputItem = data.inputItems.find(
        (inputItem) => inputItem.id === targetHandle,
      );
      if (inputItem === undefined) {
        throw new Error(`Should find input port ${targetHandle}`);
      }
      inputItem.showInputField = true;
      // Set the new data to notify React Flow about the change
      const newData: NodeData = { ...node.data };
      node.data = newData;
    }

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

const updateLastSelectedNodeId = (nodes: Node[]): string | null => {
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

const deselectLastSelectedNode = (
  nodes: Node[],
  lastSelectedNodeId: string | null,
): Node[] => {
  const node = findLastSelectedNode(nodes, lastSelectedNodeId);
  if (node !== null) {
    node.selected = false;
  }
  return nodes;
};

const getNonEmptyConnectionsFromEdges = (
  edges: Edge[],
): NonEmptyConnection[] => {
  return edges
    .filter(
      (edge) => edge.targetHandle !== null && edge.targetHandle !== undefined,
    )
    .map((edge) => {
      if (edge.targetHandle === null || edge.targetHandle === undefined) {
        throw new Error("Should filter out null or undefined targetHandle");
      }

      const nonEmptyConnection: NonEmptyConnection = {
        source: edge.source,
        target: edge.target,
        targetHandle: edge.targetHandle,
      };
      return nonEmptyConnection;
    });
};

const buildReactFlowNodeData = (
  featureNodeType: FeatureNodeType,
  nodeId: string,
  featureOperations: FeatureOperation[],
  isReverseMode: boolean,
  derivativeTarget: string | null,
  onInputChange: InputChangeCallback,
  onBodyClick: BodyClickCallback,
): NodeData => {
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
  deselectLastSelectedNode,
  findRemovedEdges,
  getNewReactFlowNodePosition,
  getNonEmptyConnectionsFromEdges,
  hideInputField,
  selectReactFlowNode,
  showInputFields,
  updateLastSelectedNodeId,
  updateReactFlowNodeDerivatives,
  updateReactFlowNodeFValues,
  updateReactFlowNodeInputValue,
};
