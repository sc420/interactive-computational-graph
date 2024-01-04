import { fireEvent, render, screen } from "@testing-library/react";
import Title from "./Title";

test("should render the children", () => {
  const handleToggleSidebar = jest.fn();
  const handleToggleDarkMode = jest.fn();
  render(
    <Title
      isSidebarOpen={true}
      onToggleSidebar={handleToggleSidebar}
      isDarkMode={false}
      onToggleDarkMode={handleToggleDarkMode}
    >
      Children
    </Title>,
  );

  const childText = screen.getByText("Children");
  expect(childText).toBeInTheDocument();
});

test("should render dark mode icon when it's dark mode", () => {
  const handleToggleSidebar = jest.fn();
  const handleToggleDarkMode = jest.fn();
  render(
    <Title
      isSidebarOpen={true}
      onToggleSidebar={handleToggleSidebar}
      isDarkMode={true}
      onToggleDarkMode={handleToggleDarkMode}
    >
      Children
    </Title>,
  );

  const darkModeIcon = screen.getByLabelText("Dark mode");
  expect(darkModeIcon).toBeInTheDocument();
});

test("should render light mode icon when it's light mode", () => {
  const handleToggleSidebar = jest.fn();
  const handleToggleDarkMode = jest.fn();
  render(
    <Title
      isSidebarOpen={true}
      onToggleSidebar={handleToggleSidebar}
      isDarkMode={false}
      onToggleDarkMode={handleToggleDarkMode}
    >
      Children
    </Title>,
  );

  const lightModeIcon = screen.getByLabelText("Light mode");
  expect(lightModeIcon).toBeInTheDocument();
});

test("should trigger event when clicking the menu icon", () => {
  const handleToggleSidebar = jest.fn();
  const handleToggleDarkMode = jest.fn();
  render(
    <Title
      isSidebarOpen={true}
      onToggleSidebar={handleToggleSidebar}
      isDarkMode={false}
      onToggleDarkMode={handleToggleDarkMode}
    >
      Children
    </Title>,
  );

  const menuIcon = screen.getByLabelText("Open menu");
  fireEvent.click(menuIcon);
  expect(handleToggleSidebar).toHaveBeenCalledWith();
});

test("should trigger event when clicking the light/dark mode icon", () => {
  const handleToggleSidebar = jest.fn();
  const handleToggleDarkMode = jest.fn();
  render(
    <Title
      isSidebarOpen={true}
      onToggleSidebar={handleToggleSidebar}
      isDarkMode={false}
      onToggleDarkMode={handleToggleDarkMode}
    >
      Children
    </Title>,
  );

  const switchIcon = screen.getByLabelText("Switch light/dark mode");
  fireEvent.click(switchIcon);
  expect(handleToggleDarkMode).toHaveBeenCalledWith();
});
