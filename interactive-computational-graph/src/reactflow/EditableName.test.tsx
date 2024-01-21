import { fireEvent, render, screen } from "@testing-library/react";
import type OperationNodeData from "../features/OperationNodeData";
import EditableName from "./EditableName";

jest.mock("../latex/Katex");

test("should render the name only", () => {
  const handleNameChange = jest.fn();
  const handleEditingChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onEditingChange={handleEditingChange}
      onNameChange={handleNameChange}
    />,
  );

  expect(screen.getByText("abc")).toBeInTheDocument();
});

test("should render the name and operation text", () => {
  const operationData = getOperationData();
  const handleEditingChange = jest.fn();
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={operationData}
      onEditingChange={handleEditingChange}
      onNameChange={handleNameChange}
    />,
  );

  expect(screen.getByText("abc")).toBeInTheDocument();
  expect(screen.getByText("(Operation 1)")).toBeInTheDocument();
});

test("should trigger events when blurred", () => {
  const handleEditingChange = jest.fn();
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onEditingChange={handleEditingChange}
      onNameChange={handleNameChange}
    />,
  );

  clickEditIcon();
  expect(handleEditingChange).toBeCalledWith(true);

  changeName("123");
  const input = getEditingTextbox();
  fireEvent.blur(input);

  expect(handleEditingChange).toBeCalledWith(false);
  expect(handleNameChange).toBeCalledWith("123");
});

test("should trigger events when Enter is pressed", () => {
  const handleEditingChange = jest.fn();
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onEditingChange={handleEditingChange}
      onNameChange={handleNameChange}
    />,
  );

  clickEditIcon();
  expect(handleEditingChange).toBeCalledWith(true);

  changeName("123");
  const input = getEditingTextbox();
  fireEvent.keyDown(input, { key: "Enter" });

  expect(handleEditingChange).toBeCalledWith(false);
  expect(handleNameChange).toBeCalledWith("123");
});

test("should trigger events when Escape is pressed", () => {
  const handleEditingChange = jest.fn();
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onEditingChange={handleEditingChange}
      onNameChange={handleNameChange}
    />,
  );

  clickEditIcon();
  expect(handleEditingChange).toBeCalledWith(true);

  changeName("123");
  const input = getEditingTextbox();
  fireEvent.keyDown(input, { key: "Escape" });

  expect(handleEditingChange).toBeCalledWith(false);
  expect(handleNameChange).not.toBeCalled();
});

test("should trim name when blurred", () => {
  const handleEditingChange = jest.fn();
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onEditingChange={handleEditingChange}
      onNameChange={handleNameChange}
    />,
  );

  clickEditIcon();
  changeName("  123  ");
  const input = getEditingTextbox();
  fireEvent.blur(input);

  expect(handleNameChange).toBeCalledWith("123");
});

test("should trim name when Enter is pressed", () => {
  const handleEditingChange = jest.fn();
  const handleNameChange = jest.fn();
  render(
    <EditableName
      name="abc"
      operationData={null}
      onEditingChange={handleEditingChange}
      onNameChange={handleNameChange}
    />,
  );

  clickEditIcon();
  changeName("  123  ");
  const input = getEditingTextbox();
  fireEvent.keyDown(input, { key: "Enter" });

  expect(handleNameChange).toBeCalledWith("123");
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
