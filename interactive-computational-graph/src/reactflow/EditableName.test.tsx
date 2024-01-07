import { fireEvent, render, screen } from "@testing-library/react";
import type OperationNodeData from "../features/OperationNodeData";
import EditableName from "./EditableName";

jest.mock("../latex/Katex");

test("should render the name only", () => {
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onNameChange={handleNameChange}
    />,
  );

  expect(screen.getByText("abc")).toBeInTheDocument();
});

test("should render the name and operation text", () => {
  const operationData = getOperationData();
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={operationData}
      onNameChange={handleNameChange}
    />,
  );

  expect(screen.getByText("abc")).toBeInTheDocument();
  expect(screen.getByText("(Operation 1)")).toBeInTheDocument();
});

test("should trigger event with updated name when blurred", () => {
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onNameChange={handleNameChange}
    />,
  );

  clickEditIcon();
  changeName("123");
  const input = getEditingTextbox();
  fireEvent.blur(input);

  expect(handleNameChange).toBeCalledWith("123");
});

test("should trigger event with updated name when Enter is pressed", () => {
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onNameChange={handleNameChange}
    />,
  );

  clickEditIcon();
  changeName("123");
  const input = getEditingTextbox();
  fireEvent.keyDown(input, { key: "Enter" });

  expect(handleNameChange).toBeCalledWith("123");
});

test("should not trigger event with old name when Escape is pressed", () => {
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onNameChange={handleNameChange}
    />,
  );

  clickEditIcon();
  changeName("123");
  const input = getEditingTextbox();
  fireEvent.keyDown(input, { key: "Escape" });

  expect(handleNameChange).not.toBeCalled();
});

const getOperationData = (): OperationNodeData | null => {
  return {
    text: "Operation 1",
    helpText: "Do something",
  };
};

const clickEditIcon = (): void => {
  const editIcon = screen.getByRole("button", { name: "edit" });
  fireEvent.click(editIcon);
};

const changeName = (name: string): void => {
  const input = getEditingTextbox();
  fireEvent.change(input, {
    target: { value: name },
  });
};

const getEditingTextbox = (): HTMLElement => {
  return screen.getByRole("textbox");
};
