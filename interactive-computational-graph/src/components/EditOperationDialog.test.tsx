import { fireEvent, render, screen } from "@testing-library/react";
import Operation from "../core/Operation";
import Port from "../core/Port";
import { ADD_DFDX_CODE, ADD_F_CODE } from "../features/BuiltInCode";
import type FeatureOperation from "../features/FeatureOperation";
import EditOperationDialog from "./EditOperationDialog";

test("should render the tabs", () => {
  const featureOperation = getFeatureOperation();
  const handleCancel = jest.fn();
  const handleSave = jest.fn();
  const handleDelete = jest.fn();
  render(
    <EditOperationDialog
      open={true}
      isDarkMode={false}
      readOperation={featureOperation}
      onCancel={handleCancel}
      onSave={handleSave}
      onDelete={handleDelete}
    />,
  );

  expect(screen.getByText("Name")).toBeInTheDocument();

  const inputPortsTab = screen.getByText("Input Ports");
  fireEvent.click(inputPortsTab);

  expect(screen.getByText("Port ID")).toBeInTheDocument();

  const fCodeTab = screen.getByText("F Code");
  fireEvent.click(fCodeTab);

  // TODO(sc420): Expect some element to be in the document

  const dfDxCodeTab = screen.getByText("DF/DX Code");
  fireEvent.click(dfDxCodeTab);

  // TODO(sc420): Expect some element to be in the document
});

test("should trigger event when clicking save button", () => {
  const featureOperation = getFeatureOperation();
  const handleCancel = jest.fn();
  const handleSave = jest.fn();
  const handleDelete = jest.fn();
  render(
    <EditOperationDialog
      open={true}
      isDarkMode={false}
      readOperation={featureOperation}
      onCancel={handleCancel}
      onSave={handleSave}
      onDelete={handleDelete}
    />,
  );

  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);
  expect(handleSave).toHaveBeenCalledWith(featureOperation);
  expect(handleCancel).not.toHaveBeenCalled();
  expect(handleDelete).not.toHaveBeenCalled();
});

test("should trigger necessary event when clicking cancel button after change", () => {
  const featureOperation = getFeatureOperation();
  const handleCancel = jest.fn();
  const handleSave = jest.fn();
  const handleDelete = jest.fn();
  render(
    <EditOperationDialog
      open={true}
      isDarkMode={false}
      readOperation={featureOperation}
      onCancel={handleCancel}
      onSave={handleSave}
      onDelete={handleDelete}
    />,
  );

  const nameInput = screen.getByTestId("nameInput");
  fireEvent.change(nameInput, { target: { value: "Add2" } });

  const closeIconButton = screen.getByLabelText("close");
  fireEvent.click(closeIconButton);
  expect(handleSave).not.toHaveBeenCalled();
  expect(handleCancel).toHaveBeenCalled();
  expect(handleDelete).not.toHaveBeenCalled();
});

const getFeatureOperation = (): FeatureOperation => {
  return {
    id: "add",
    text: "Add",
    type: "SIMPLE",
    namePrefix: "a",
    operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
    inputPorts: [new Port("a", false), new Port("b", false)],
    helpText: "Add two numbers $ a + b $",
  };
};
