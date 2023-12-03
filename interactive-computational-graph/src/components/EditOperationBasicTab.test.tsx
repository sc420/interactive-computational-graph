import { fireEvent, render, screen } from "@testing-library/react";
import EditOperationBasicTab from "./EditOperationBasicTab";

test("validation should fail when name is empty", () => {
  const handleChangeValues = jest.fn();
  const handleValidate = jest.fn();
  render(
    <EditOperationBasicTab
      name="Name"
      prefix="Prefix"
      helpText="Help text"
      onChangeValues={handleChangeValues}
      onValidate={handleValidate}
    />,
  );

  const nameInput = screen.getByTestId("nameInput");
  fireEvent.change(nameInput, { target: { value: "" } });

  expect(handleChangeValues).toBeCalledTimes(1);
  expect(handleChangeValues).toHaveBeenCalledWith(
    "Name",
    "Prefix",
    "Help text",
  );
  expect(handleValidate).lastCalledWith(false);
});

test("values should change when inputs are updated", () => {
  const handleChangeValues = jest.fn();
  const handleValidate = jest.fn();
  render(
    <EditOperationBasicTab
      name="Name"
      prefix="Prefix"
      helpText="Help text"
      onChangeValues={handleChangeValues}
      onValidate={handleValidate}
    />,
  );

  const nameInput = screen.getByTestId("nameInput");
  fireEvent.change(nameInput, { target: { value: "Name 2" } });

  const prefixInput = screen.getByTestId("prefixInput");
  fireEvent.change(prefixInput, { target: { value: "Prefix 2" } });

  const helpTextInput = screen.getByTestId("helpTextInput");
  fireEvent.change(helpTextInput, { target: { value: "Help text 2" } });

  expect(handleChangeValues).toHaveBeenCalledWith(
    "Name 2",
    "Prefix",
    "Help text",
  );
  expect(handleChangeValues).toHaveBeenCalledWith(
    "Name 2",
    "Prefix 2",
    "Help text",
  );
  expect(handleChangeValues).toHaveBeenCalledWith(
    "Name 2",
    "Prefix 2",
    "Help text 2",
  );
  expect(handleValidate).toHaveBeenCalledWith(true);
  expect(handleValidate).not.toHaveBeenCalledWith(false);
});
