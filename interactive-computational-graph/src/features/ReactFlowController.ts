import { type Node, type XYPosition } from "reactflow";
import { findFeatureOperation } from "./ControllerUtilities";
import type FeatureOperation from "./FeatureOperation";
import { constantType, variableType } from "./KnownNodeTypes";
import type NodeData from "./NodeData";

type BodyClickCallback = (id: string) => void;

const addReactFlowNode = (
  nodeType: string,
  id: string,
  featureOperations: FeatureOperation[],
  onBodyClick: BodyClickCallback,
  position: XYPosition,
  nodes: Node[],
): Node[] => {
  const node: Node = {
    id,
    type: "custom", // registered in Graph
    data: buildReactFlowNodeData(nodeType, id, featureOperations, onBodyClick),
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

const updateLastSelectedNodeId = (nodes: Node[]): string | null => {
  const firstNode = nodes.find((node) => "id" in node) ?? null;
  if (firstNode === null) {
    return null;
  }
  return firstNode.id;
};

const selectReactFlowNode = (id: string, nodes: Node[]): Node[] => {
  return nodes.map((node) => {
    if (node.id !== id) {
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

const buildReactFlowNodeData = (
  nodeType: string,
  id: string,
  featureOperations: FeatureOperation[],
  onBodyClick: BodyClickCallback,
): NodeData => {
  const callOnBodyClick = (id: string): void => {
    onBodyClick(id);
  };

  switch (nodeType) {
    case constantType: {
      return {
        text: `c${id}`,
        nodeType,
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
        onBodyClick: callOnBodyClick,
      };
    }
    case variableType: {
      const text = `v${id}`;
      return {
        text,
        nodeType,
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
            id: "derivative",
            text: `d(y)/d(${text}) =`,
            value: "5",
          },
        ],
        onBodyClick: callOnBodyClick,
      };
    }
    default: {
      // Operation
      const featureOperation = findFeatureOperation(
        nodeType,
        featureOperations,
      );

      const text = featureOperation.text;
      return {
        text,
        nodeType,
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
            id: "value",
            text: "=",
            value: "0",
          },
          {
            id: "derivative",
            text: `d(y)/d(${text}) =`,
            value: "0",
          },
        ],
        onBodyClick: callOnBodyClick,
      };
    }
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

const randomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export {
  addReactFlowNode,
  getNewReactFlowNodePosition,
  updateLastSelectedNodeId,
  selectReactFlowNode,
  deselectLastSelectedNode,
};
