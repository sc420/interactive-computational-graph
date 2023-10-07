import { fireEvent, render, screen } from "@testing-library/react";
import EditableName from "./EditableName";

jest.mock("../latex/Katex");

test("should render the name", () => {
  const handleNameChange = jest.fn();
  render(<EditableName name="abc" onNameChange={handleNameChange} />);

  expect(screen.getByText("abc")).toBeInTheDocument();
});

test("should trigger event with updated name when blurred", () => {
  const handleNameChange = jest.fn();
  render(<EditableName name="abc" onNameChange={handleNameChange} />);

  clickEditIcon();
  changeName("123");
  const input = getEditingTextbox();
  fireEvent.blur(input);

  expect(handleNameChange).toBeCalledWith("123");
});

test("should trigger event with updated name when Enter is pressed", () => {
  const handleNameChange = jest.fn();
  render(<EditableName name="abc" onNameChange={handleNameChange} />);

  clickEditIcon();
  changeName("123");
  const input = getEditingTextbox();
  fireEvent.keyDown(input, { key: "Enter" });

  expect(handleNameChange).toBeCalledWith("123");
});

test("should not trigger event with old name when Escape is pressed", () => {
  const handleNameChange = jest.fn();
  render(<EditableName name="abc" onNameChange={handleNameChange} />);

  clickEditIcon();
  changeName("123");
  const input = getEditingTextbox();
  fireEvent.keyDown(input, { key: "Escape" });

  expect(handleNameChange).not.toBeCalled();
});

const clickEditIcon = (): void => {
  const copyIcon = screen.getByRole("button", { name: "edit" });
  fireEvent.click(copyIcon);
};

const changeName = (name: string): void => {
  const input = getEditingTextbox();
  fireEvent.change(input, {
    target: { value: name },
  });
};

const getEditingTextbox = (): HTMLElement => {
  return screen.getByRole("textbox");
};
