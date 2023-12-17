import { fireEvent, render, screen } from "@testing-library/react";
import Port from "../core/Port";
import { ADD_DFDX_CODE } from "../features/BuiltInCode";
import {
  getInputNodeToValues,
  getInputPortToNodes,
  getTestResult,
  getXId,
  setCode,
  setInputNodeToValues,
  setInputPortToNodes,
  setXId,
} from "./EditOperationCodeTabTestUtils";
import EditOperationDfdxCodeTab from "./EditOperationDfdxCodeTab";

jest.mock("../editor/MonacoEditor");
jest.mock("../features/RandomUtilities");
jest.mock("../latex/Katex");

test("should trigger event when the code is updated", () => {
  const inputPorts: Port[] = [new Port("a", false), new Port("b", false)];
  const handleChangeValues = jest.fn();
  render(
    <EditOperationDfdxCodeTab
      dfdxCode={ADD_DFDX_CODE}
      inputPorts={inputPorts}
      isDarkMode={false}
      onChangeValues={handleChangeValues}
    />,
  );

  setCode("123");

  expect(handleChangeValues).toBeCalledWith("123");
});

test("should run test successfully", () => {
  const inputPorts: Port[] = [new Port("a", false), new Port("b", false)];
  const handleChangeValues = jest.fn();
  render(
    <EditOperationDfdxCodeTab
      dfdxCode={ADD_DFDX_CODE}
      inputPorts={inputPorts}
      isDarkMode={false}
      onChangeValues={handleChangeValues}
    />,
  );

  setInputPortToNodes(
    JSON.stringify({
      a: ["0"],
      b: ["1"],
    }),
  );

  setInputNodeToValues(
    JSON.stringify({
      "0": "0.5",
      "1": "0.5",
    }),
  );

  setXId("0");

  const runTestButton = screen.getByLabelText(
    "Run the df/dx code with the three test data",
  );
  fireEvent.click(runTestButton);

  expect(getTestResult()).toBe("1");
  const errorTooltip = screen.queryByTestId("errorTooltip");
  expect(errorTooltip).not.toBeInTheDocument();
  const upToDateTooltip = screen.getByTestId("upToDateTooltip");
  expect(upToDateTooltip).toBeInTheDocument();
});

test("should randomize test data", () => {
  const inputPorts: Port[] = [new Port("a", false), new Port("b", false)];
  const handleChangeValues = jest.fn();
  render(
    <EditOperationDfdxCodeTab
      dfdxCode={ADD_DFDX_CODE}
      inputPorts={inputPorts}
      isDarkMode={false}
      onChangeValues={handleChangeValues}
    />,
  );

  setInputPortToNodes(
    JSON.stringify({
      a: [],
      b: [],
    }),
  );

  setInputNodeToValues(JSON.stringify({}));

  setXId("");

  const randomizeButton = screen.getByLabelText(
    "Randomize the three test data",
  );
  fireEvent.click(randomizeButton);

  expect(JSON.parse(getInputPortToNodes())).toEqual({
    a: ["0"],
    b: ["1"],
  });
  expect(JSON.parse(getInputNodeToValues())).toEqual({
    "0": "10",
    "1": "10",
  });
  expect(getXId()).toEqual("100");
});

test("should show error when code is invalid", () => {
  const mockConsole = jest.spyOn(console, "error").mockImplementation();

  const inputPorts: Port[] = [new Port("a", false), new Port("b", false)];
  const handleChangeValues = jest.fn();
  render(
    <EditOperationDfdxCodeTab
      dfdxCode="abc"
      inputPorts={inputPorts}
      isDarkMode={false}
      onChangeValues={handleChangeValues}
    />,
  );

  setInputPortToNodes(
    JSON.stringify({
      a: ["0"],
      b: ["1"],
    }),
  );

  setInputNodeToValues(
    JSON.stringify({
      "0": "0.5",
      "1": "0.5",
    }),
  );

  setXId("0");

  const runTestButton = screen.getByLabelText(
    "Run the df/dx code with the three test data",
  );
  fireEvent.click(runTestButton);

  expect(getTestResult()).toContain(
    "Error occurred when running eval with the user code",
  );
  expect(getTestResult()).toContain(
    "Please make sure the following code is executable:",
  );
  expect(getTestResult()).toContain("Stack trace:");
  const errorTooltip = screen.getByTestId("errorTooltip");
  expect(errorTooltip).toBeInTheDocument();
  expect(mockConsole).toHaveBeenCalled();
  const upToDateTooltip = screen.queryByTestId("upToDateTooltip");
  expect(upToDateTooltip).not.toBeInTheDocument();

  jest.restoreAllMocks(); // restores the spy created with spyOn
});

test("should show error when input port to nodes data is invalid", () => {
  jest.spyOn(console, "error").mockImplementation();

  const inputPorts: Port[] = [new Port("a", false), new Port("b", false)];
  const handleChangeValues = jest.fn();
  render(
    <EditOperationDfdxCodeTab
      dfdxCode={ADD_DFDX_CODE}
      inputPorts={inputPorts}
      isDarkMode={false}
      onChangeValues={handleChangeValues}
    />,
  );

  setInputPortToNodes("abc");

  setInputNodeToValues(
    JSON.stringify({
      "0": "0.5",
      "1": "0.5",
    }),
  );

  setXId("0");

  const runTestButton = screen.getByLabelText(
    "Run the df/dx code with the three test data",
  );
  fireEvent.click(runTestButton);

  expect(getTestResult()).toContain(
    "Couldn't parse the input port to nodes data",
  );
  const errorTooltip = screen.getByTestId("errorTooltip");
  expect(errorTooltip).toBeInTheDocument();
  const upToDateTooltip = screen.queryByTestId("upToDateTooltip");
  expect(upToDateTooltip).not.toBeInTheDocument();

  jest.restoreAllMocks(); // restores the spy created with spyOn
});

test("should show error when node to values data is invalid", () => {
  jest.spyOn(console, "error").mockImplementation();

  const inputPorts: Port[] = [new Port("a", false), new Port("b", false)];
  const handleChangeValues = jest.fn();
  render(
    <EditOperationDfdxCodeTab
      dfdxCode={ADD_DFDX_CODE}
      inputPorts={inputPorts}
      isDarkMode={false}
      onChangeValues={handleChangeValues}
    />,
  );

  setInputPortToNodes(
    JSON.stringify({
      a: ["0"],
      b: ["1"],
    }),
  );

  setInputNodeToValues("abc");

  setXId("0");

  const runTestButton = screen.getByLabelText(
    "Run the df/dx code with the three test data",
  );
  fireEvent.click(runTestButton);

  expect(getTestResult()).toContain(
    "Couldn't parse the input node to values data",
  );
  const errorTooltip = screen.getByTestId("errorTooltip");
  expect(errorTooltip).toBeInTheDocument();
  const upToDateTooltip = screen.queryByTestId("upToDateTooltip");
  expect(upToDateTooltip).not.toBeInTheDocument();

  jest.restoreAllMocks(); // restores the spy created with spyOn
});
