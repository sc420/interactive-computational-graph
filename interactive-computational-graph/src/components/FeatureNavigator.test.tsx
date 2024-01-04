import { fireEvent, render, screen } from "@testing-library/react";
import FeatureNavigator from "./FeatureNavigator";

test("should render the selected item", () => {
  const handleItemClick = jest.fn();
  render(
    <FeatureNavigator selectedItem="add-nodes" onItemClick={handleItemClick} />,
  );

  const addNodesItem = screen.getByText("Add Nodes");
  expect(addNodesItem).toHaveStyle("background-color: rgb(200, 230, 231");
});

test("should trigger event when clicking the non-selected item", () => {
  const handleItemClick = jest.fn();
  render(
    <FeatureNavigator selectedItem={null} onItemClick={handleItemClick} />,
  );

  const addNodesItem = screen.getByText("Add Nodes");
  fireEvent.click(addNodesItem);
  expect(handleItemClick).toHaveBeenCalledWith("add-nodes");
});

test("should trigger event when clicking the selected item", () => {
  const handleItemClick = jest.fn();
  render(
    <FeatureNavigator selectedItem="add-nodes" onItemClick={handleItemClick} />,
  );

  const addNodesItem = screen.getByText("Add Nodes");
  fireEvent.click(addNodesItem);
  expect(handleItemClick).toHaveBeenCalledWith(null);
});
