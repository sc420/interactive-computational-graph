import type Port from "../core/Port";
import { randomInteger } from "./RandomUtilities";

const buildRandomInputPortToNodes = (
  inputPorts: Port[],
): Record<string, string[]> => {
  const inputPortToNodes: Record<string, string[]> = {};
  let nextId = 0;
  inputPorts.forEach((inputPort) => {
    // Use only one node to avoid showing errors for those operations that
    // don't allow multiple input nodes
    const numNodes = 1;
    inputPortToNodes[inputPort.getId()] = buildRandomNodeIds(nextId, numNodes);
    nextId += numNodes;
  });
  return inputPortToNodes;
};

const buildRandomNodeIds = (nextId: number, numNodes: number): string[] => {
  const nodeIds = Array.from(
    { length: numNodes },
    (_, index) => nextId + index,
  );
  return nodeIds.map((nodeId) => `${nodeId}`);
};

const getNumNodesInInputPortToNodes = (
  inputPortToNodes: Record<string, string[]>,
): number => {
  return Object.values(inputPortToNodes).reduce(
    (count, nodes) => count + nodes.length,
    0,
  );
};

const buildRandomInputNodeToValues = (
  numNodes: number,
): Record<string, string> => {
  const inputNodeToValues: Record<string, string> = {};
  const nodeIds = Array.from({ length: numNodes }, (_, index) => `${index}`);
  nodeIds.forEach((nodeId) => {
    const value = randomInteger(-10, 10) / 10;
    inputNodeToValues[nodeId] = `${value}`;
  });
  return inputNodeToValues;
};

export {
  buildRandomInputNodeToValues,
  buildRandomInputPortToNodes,
  getNumNodesInInputPortToNodes,
};
