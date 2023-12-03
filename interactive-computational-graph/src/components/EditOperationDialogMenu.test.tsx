import { fireEvent, render, screen } from "@testing-library/react";
import EditOperationDialogMenu from "./EditOperationDialogMenu";

test("should trigger event when clicking delete menu item", () => {
  const handleDelete = jest.fn();
  render(<EditOperationDialogMenu onDelete={handleDelete} />);

  const menuButton = screen.getByLabelText("more");
  fireEvent.click(menuButton);

  const deleteOperationMenuItem = screen.getByText("Delete Operation");
  fireEvent.click(deleteOperationMenuItem);

  expect(handleDelete).toHaveBeenCalled();
});
