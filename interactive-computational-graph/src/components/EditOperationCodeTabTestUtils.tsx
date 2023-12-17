import { fireEvent, screen } from "@testing-library/react";

const setCode = (code: string): void => {
  const codeInput = getCodeInput();
  fireEvent.change(codeInput, { target: { value: code } });
};

const setInputPortToNodes = (inputPortToNodesJson: string): void => {
  const inputPortToNodesInput = getInputPortToNodesInput();
  fireEvent.change(inputPortToNodesInput, {
    target: { value: inputPortToNodesJson },
  });
};

const setInputNodeToValues = (inputNodeToValuesJson: string): void => {
  const inputNodeToValuesInput = getInputNodeToValuesInput();
  fireEvent.change(inputNodeToValuesInput, {
    target: { value: inputNodeToValuesJson },
  });
};

const setXId = (xId: string): void => {
  const xIdInput = getXIdInput();
  fireEvent.change(xIdInput, {
    target: { value: xId },
  });
};

const getInputPortToNodes = (): string => {
  const testResultInput = getInputPortToNodesInput();
  return testResultInput.value;
};

const getInputNodeToValues = (): string => {
  const testResultInput = getInputNodeToValuesInput();
  return testResultInput.value;
};

const getXId = (): string => {
  const xIdInput = getXIdInput();
  return xIdInput.value;
};

const getTestResult = (): string => {
  const testResultInput = getTestResultInput();
  return testResultInput.value;
};

const getCodeInput = (): HTMLInputElement => {
  const input = screen.getByTestId("code");
  return input as HTMLInputElement;
};

const getInputPortToNodesInput = (): HTMLInputElement => {
  const input = screen.getByTestId("inputPortToNodes");
  return input as HTMLInputElement;
};

const getInputNodeToValuesInput = (): HTMLInputElement => {
  const input = screen.getByTestId("inputNodeToValues");
  return input as HTMLInputElement;
};

const getXIdInput = (): HTMLInputElement => {
  const input = screen.getByTestId("xId");
  return input as HTMLInputElement;
};

const getTestResultInput = (): HTMLInputElement => {
  const input = screen.getByTestId("testResult");
  return input as HTMLInputElement;
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
