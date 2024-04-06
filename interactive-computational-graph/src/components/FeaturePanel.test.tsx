import { fireEvent, render, screen } from "@testing-library/react";
import Operation from "../core/Operation";
import Port from "../core/Port";
import { ADD_DFDX_CODE, ADD_F_CODE } from "../features/BuiltInCode";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import FeaturePanel from "./FeaturePanel";

/**
 * We don't need to test all callbacks exhaustively because this test is more
 * like integration test. We just make sure at least one callback can work
 * properly.
 */

test("should trigger event when adding a node", () => {
  const featureOperations = getFeatureOperations();
  const handleAddNode = jest.fn();
  const handleAddOperation = jest.fn();
  const handleEditOperation = jest.fn();
  const handleDeleteOperation = jest.fn();
  const handleClearSelection = jest.fn();
  const handleSelectNode = jest.fn();
  const handleSave = jest.fn();
  const handleLoad = jest.fn();
  render(
    <FeaturePanel
      feature="add-nodes"
      featureOperations={featureOperations}
      operationIdsAddedAtLeastOnce={new Set()}
      hasNodes={false}
      hasDerivativeTarget={false}
      explainDerivativeData={[]}
      isDarkMode={false}
      onAddNode={handleAddNode}
      onAddOperation={handleAddOperation}
      onEditOperation={handleEditOperation}
      onDeleteOperation={handleDeleteOperation}
      onClearSelection={handleClearSelection}
      onSelectNode={handleSelectNode}
      onSave={handleSave}
      onLoad={handleLoad}
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

const getFeatureOperations = (): FeatureOperation[] => {
  return [
    {
      id: "add",
      name: "Add",
      type: "basic",
      namePrefix: "a",
      operation: new Operation(ADD_F_CODE, ADD_DFDX_CODE),
      inputPorts: [new Port("a", false), new Port("b", false)],
      helpText: "Add two numbers $ a + b $",
    },
  ];
};
