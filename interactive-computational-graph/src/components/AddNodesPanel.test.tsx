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
  render(
    <AddNodesPanel
      featureOperations={featureOperations}
      onAddNode={handleAddNode}
      onAddOperation={handleAddOperation}
      onEditOperation={handleEditOperation}
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
  render(
    <AddNodesPanel
      featureOperations={featureOperations}
      onAddNode={handleAddNode}
      onAddOperation={handleAddOperation}
      onEditOperation={handleEditOperation}
    />,
  );

  const addOperationButton = screen.getByText("Add Operation");
  fireEvent.click(addOperationButton);
  expect(handleAddOperation).toHaveBeenCalledWith();
});

test("should trigger event when clicking edit icon button", () => {
  const featureOperations = getFeatureOperations();
  const handleAddNode = jest.fn();
  const handleAddOperation = jest.fn();
  const handleEditOperation = jest.fn();
  render(
    <AddNodesPanel
      featureOperations={featureOperations}
      onAddNode={handleAddNode}
      onAddOperation={handleAddOperation}
      onEditOperation={handleEditOperation}
    />,
  );

  const editAddButton = screen.getByLabelText("Edit Add");
  fireEvent.click(editAddButton);

  const expectedNodeType: FeatureNodeType = {
    nodeType: "OPERATION",
    operationId: "add",
  };
  expect(handleEditOperation).toHaveBeenCalledWith(expectedNodeType);
});

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
