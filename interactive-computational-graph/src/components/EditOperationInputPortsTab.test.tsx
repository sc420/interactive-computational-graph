import { fireEvent, render, screen } from "@testing-library/react";
import Port from "../core/Port";
import EditOperationInputPortsTab from "./EditOperationInputPortsTab";

test("should render the table", () => {
  const inputPorts: Port[] = [new Port("a", false), new Port("b", true)];
  const handleChangeValues = jest.fn();
  const handleValidate = jest.fn();
  render(
    <EditOperationInputPortsTab
      isVisible={true}
      inputPorts={inputPorts}
      onChangeValues={handleChangeValues}
      onValidate={handleValidate}
    />,
  );

  // Toolbar
  expect(screen.getByText("Add Port")).toBeInTheDocument();
  // Headers
  expect(screen.getByText("Port ID")).toBeInTheDocument();
  expect(screen.getByText("Allow Multiple Edges")).toBeInTheDocument();
  expect(screen.getByText("Actions")).toBeInTheDocument();
  // "Port ID" column
  expect(screen.getByText("a")).toBeInTheDocument();
  expect(screen.getByText("b")).toBeInTheDocument();
  // "Allow Multiple Edges" column
  expect(screen.getByText("Yes")).toBeInTheDocument();
  expect(screen.getByText("No")).toBeInTheDocument();
});

test("should trigger value change when deleting a row", () => {
  const inputPorts: Port[] = [new Port("a", false), new Port("b", true)];
  const handleChangeValues = jest.fn();
  const handleValidate = jest.fn();
  render(
    <EditOperationInputPortsTab
      isVisible={true}
      inputPorts={inputPorts}
      onChangeValues={handleChangeValues}
      onValidate={handleValidate}
    />,
  );

  const deleteIconButton = screen.getAllByLabelText("Delete");
  fireEvent.click(deleteIconButton[0]);

  expect(handleChangeValues).toHaveBeenCalledWith([new Port("b", true)]);
});

test("should be valid when editing the row", () => {
  const inputPorts: Port[] = [new Port("a", false), new Port("b", true)];
  const handleChangeValues = jest.fn();
  const handleValidate = jest.fn();
  render(
    <EditOperationInputPortsTab
      isVisible={true}
      inputPorts={inputPorts}
      onChangeValues={handleChangeValues}
      onValidate={handleValidate}
    />,
  );

  const editIconButton = screen.getAllByLabelText("Edit");
  fireEvent.click(editIconButton[0]);

  expect(handleValidate).lastCalledWith(true);
});

test("should be invalid when deleting all rows", () => {
  const inputPorts: Port[] = [new Port("a", false)];
  const handleChangeValues = jest.fn();
  const handleValidate = jest.fn();
  render(
    <EditOperationInputPortsTab
      isVisible={true}
      inputPorts={inputPorts}
      onChangeValues={handleChangeValues}
      onValidate={handleValidate}
    />,
  );

  const deleteIconButton = screen.getAllByLabelText("Delete");
  fireEvent.click(deleteIconButton[0]);

  expect(handleValidate).toHaveBeenCalledWith(false);
});

test("should be invalid when having empty port ID", () => {
  const inputPorts: Port[] = [new Port("", false)];
  const handleChangeValues = jest.fn();
  const handleValidate = jest.fn();
  render(
    <EditOperationInputPortsTab
      isVisible={true}
      inputPorts={inputPorts}
      onChangeValues={handleChangeValues}
      onValidate={handleValidate}
    />,
  );

  expect(handleValidate).toHaveBeenCalledWith(false);
});

test("should be invalid when having duplicate port IDs", () => {
  const inputPorts: Port[] = [new Port("a", false), new Port("a", false)];
  const handleChangeValues = jest.fn();
  const handleValidate = jest.fn();
  render(
    <EditOperationInputPortsTab
      isVisible={true}
      inputPorts={inputPorts}
      onChangeValues={handleChangeValues}
      onValidate={handleValidate}
    />,
  );

  expect(handleValidate).toHaveBeenCalledWith(false);
});
