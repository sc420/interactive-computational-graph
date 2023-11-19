import { fireEvent, render, screen } from "@testing-library/react";
import Operation from "../core/Operation";
import Port from "../core/Port";
import { ADD_DFDX_CODE, ADD_F_CODE } from "../features/BuiltInCode";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import AddNodesPanel from "./AddNodesPanel";

test("should trigger event when clicking item", () => {
  const featureOperations = getFeatureOperations();
  const handleAddNode = jest.fn();
  const handleAddOperation = jest.fn();
  const handleEditOperation = jest.fn();
  const handleDeleteOperation = jest.fn();
  render(
    <AddNodesPanel
      featureOperations={featureOperations}
      onAddNode={handleAddNode}
      onAddOperation={handleAddOperation}
      onEditOperation={handleEditOperation}
      onDeleteOperation={handleDeleteOperation}
    />,
  );

  const addItem = screen.getByText("Add");
  fireEvent.click(addItem);
  const expectedNodeType: FeatureNodeType = {
    nodeType: "OPERATION",
    operationId: "add",
  };
  expect(handleAddNode).toHaveBeenCalledWith(expectedNodeType);
});

test("should trigger event when clicking add operation button", () => {
  const featureOperations = getFeatureOperations();
  const handleAddNode = jest.fn();
  const handleAddOperation = jest.fn();
  const handleEditOperation = jest.fn();
  const handleDeleteOperation = jest.fn();
  render(
    <AddNodesPanel
      featureOperations={featureOperations}
      onAddNode={handleAddNode}
      onAddOperation={handleAddOperation}
      onEditOperation={handleEditOperation}
      onDeleteOperation={handleDeleteOperation}
    />,
  );

  const addOperationButton = screen.getByText("Add Operation");
  fireEvent.click(addOperationButton);
  expect(handleAddOperation).toHaveBeenCalledWith();
});

test("should not trigger event when canceling editing operation", () => {
  const featureOperations = getFeatureOperations();
  const handleAddNode = jest.fn();
  const handleAddOperation = jest.fn();
  const handleEditOperation = jest.fn();
  const handleDeleteOperation = jest.fn();
  render(
    <AddNodesPanel
      featureOperations={featureOperations}
      onAddNode={handleAddNode}
      onAddOperation={handleAddOperation}
      onEditOperation={handleEditOperation}
      onDeleteOperation={handleDeleteOperation}
    />,
  );

  const editAddButton = screen.getByLabelText("Edit Add");
  fireEvent.click(editAddButton);

  const closeButton = screen.getByLabelText("close");
  fireEvent.click(closeButton);

  expect(handleAddNode).not.toHaveBeenCalled();
  expect(handleAddOperation).not.toHaveBeenCalled();
  expect(handleEditOperation).not.toHaveBeenCalled();
  expect(handleDeleteOperation).not.toHaveBeenCalled();
});

test("should trigger event when clicking edit icon button", () => {
  const featureOperations = getFeatureOperations();
  const handleAddNode = jest.fn();
  const handleAddOperation = jest.fn();
  const handleEditOperation = jest.fn();
  const handleDeleteOperation = jest.fn();
  render(
    <AddNodesPanel
      featureOperations={featureOperations}
      onAddNode={handleAddNode}
      onAddOperation={handleAddOperation}
      onEditOperation={handleEditOperation}
      onDeleteOperation={handleDeleteOperation}
    />,
  );

  const editAddButton = screen.getByLabelText("Edit Add");
  fireEvent.click(editAddButton);

  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  const expectedUpdatedOperation = featureOperations[0];
  expect(handleEditOperation).toHaveBeenCalledWith(expectedUpdatedOperation);
});

// TODO(sc420): Click delete button to test for handleDeleteOperation

const getFeatureOperations = (): FeatureOperation[] => {
  return [
    {
      id: "add",
      text: "Add",
      type: "SIMPLE",
      namePrefix: "a",
      operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Add two numbers $ a + b $",
    },
  ];
};
