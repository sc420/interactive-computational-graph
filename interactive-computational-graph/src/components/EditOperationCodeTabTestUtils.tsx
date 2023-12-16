import { fireEvent, screen } from "@testing-library/react";

const setCode = (code: string): void => {
  const codeInput = screen.getByTestId("code");
  fireEvent.change(codeInput, { target: { value: code } });
};

const setInputPortToNodes = (inputPortToNodesJson: string): void => {
  const inputPortToNodesInput = screen.getByTestId("inputPortToNodes");
  fireEvent.change(inputPortToNodesInput, {
    target: { value: inputPortToNodesJson },
  });
};

const setInputNodeToValues = (inputNodeToValuesJson: string): void => {
  const inputNodeToValuesInput = screen.getByTestId("inputNodeToValues");
  fireEvent.change(inputNodeToValuesInput, {
    target: { value: inputNodeToValuesJson },
  });
};

const setXId = (xId: string): void => {
  const xIdInput = screen.getByTestId("xId");
  fireEvent.change(xIdInput, {
    target: { value: xId },
  });
};

const getInputPortToNodes = (): string => {
  const testResultInput = screen.getByTestId("inputPortToNodes");
  return (testResultInput as HTMLInputElement).value;
};

const getInputNodeToValues = (): string => {
  const testResultInput = screen.getByTestId("inputNodeToValues");
  return (testResultInput as HTMLInputElement).value;
};

const getXId = (): string => {
  const testResultInput = screen.getByTestId("xId");
  return (testResultInput as HTMLInputElement).value;
};

const getTestResult = (): string => {
  const testResultInput = screen.getByTestId("testResult");
  return (testResultInput as HTMLInputElement).value;
};

export {
  getInputNodeToValues,
  getInputPortToNodes,
  getTestResult,
  getXId,
  setCode,
  setInputNodeToValues,
  setInputPortToNodes,
  setXId,
};
