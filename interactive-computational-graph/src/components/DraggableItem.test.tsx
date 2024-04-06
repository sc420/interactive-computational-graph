import { fireEvent, render, screen } from "@testing-library/react";
import type FeatureNodeType from "../features/FeatureNodeType";
import DraggableItem from "./DraggableItem";

test("should trigger event when clicking item", () => {
  const featureNodeType: FeatureNodeType = { nodeType: "constant" };
  const handleClickItem = jest.fn();
  const handleClickEditIcon = jest.fn();
  render(
    <DraggableItem
      featureNodeType={featureNodeType}
      text="Constant"
      helpText="Set a constant value"
      editable={false}
      onClickItem={handleClickItem}
      onClickEditIcon={handleClickEditIcon}
    />,
  );

  const listItem = screen.getByText("Constant");
  fireEvent.click(listItem);
  expect(handleClickItem).toHaveBeenCalledWith(featureNodeType);
});

test("should trigger event when clicking the edit icon", () => {
  const featureNodeType: FeatureNodeType = { nodeType: "constant" };
  const handleClickItem = jest.fn();
  const handleClickEditIcon = jest.fn();
  render(
    <DraggableItem
      featureNodeType={featureNodeType}
      text="Constant"
      helpText="Set a constant value"
      editable
      onClickItem={handleClickItem}
      onClickEditIcon={handleClickEditIcon}
    />,
  );

  const editIcon = screen.getByLabelText("Edit Constant");
  fireEvent.click(editIcon);
  expect(handleClickEditIcon).toHaveBeenCalledWith(featureNodeType);
});
