import { fireEvent, render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar";

test("should render the children", () => {
  const handleToggleSidebar = jest.fn();
  render(
    <Sidebar isSidebarOpen={true} onToggleSidebar={handleToggleSidebar}>
      Children
    </Sidebar>,
  );

  const childText = screen.getByText("Children");
  expect(childText).toBeInTheDocument();
});

test("should trigger event when clicking the icon", () => {
  const handleToggleSidebar = jest.fn();
  render(
    <Sidebar isSidebarOpen={false} onToggleSidebar={handleToggleSidebar}>
      Children
    </Sidebar>,
  );

  const toggleSidebarIconButton = screen.getByLabelText("Toggle Sidebar");
  fireEvent.click(toggleSidebarIconButton);
  expect(handleToggleSidebar).toHaveBeenCalledWith();
});
