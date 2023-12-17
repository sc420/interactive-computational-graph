import Port from "../core/Port";
import {
  buildRandomInputNodeToValues,
  buildRandomInputPortToNodes,
  getNumNodesInInputPortToNodes,
} from "./RandomTestDataGenerator";

jest.mock("../features/RandomUtilities");

test("should build empty input port to nodes when there're no input ports", () => {
  const inputPorts: Port[] = [];
  const inputPortToNodes = buildRandomInputPortToNodes(inputPorts);
  expect(inputPortToNodes).toEqual({});
});

test("should build the input port to nodes when there're two input ports", () => {
  const inputPorts: Port[] = [new Port("a", false), new Port("b", true)];
  const inputPortToNodes = buildRandomInputPortToNodes(inputPorts);
  expect(inputPortToNodes).toEqual({
    a: ["0"],
    b: ["1"],
  });
});

test("should get the correct number of nodes in input port to nodes data", () => {
  expect(getNumNodesInInputPortToNodes({})).toBe(0);

  expect(
    getNumNodesInInputPortToNodes({
      a: ["0"],
    }),
  ).toBe(1);

  expect(
    getNumNodesInInputPortToNodes({
      a: ["0"],
      b: ["1"],
      c: ["2"],
    }),
  ).toBe(3);

  expect(
    getNumNodesInInputPortToNodes({
      a: ["0", "1"],
      b: ["2", "3", "4"],
      c: ["5"],
    }),
  ).toBe(6);
});

test("should build input node to values with no nodes", () => {
  expect(buildRandomInputNodeToValues(0)).toEqual({});
});

test("should build input node to values with 1 node", () => {
  expect(buildRandomInputNodeToValues(1)).toEqual({
    "0": "10",
  });
});

test("should build input node to values with 2 nodes", () => {
  expect(buildRandomInputNodeToValues(2)).toEqual({
    "0": "10",
    "1": "10",
  });
});

test("should build input node to values with 3 nodes", () => {
  expect(buildRandomInputNodeToValues(3)).toEqual({
    "0": "10",
    "1": "10",
    "2": "10",
  });
});
