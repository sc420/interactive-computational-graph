import { fireEvent, render, screen, within } from "@testing-library/react";
import GraphToolbar from "./GraphToolbar";

test("should show no derivative target initially", () => {
  const nodeIds: string[] = [];
  const nodeNames: string[] = [];
  const handleReverseModeChange = jest.fn();
  const handleDerivativeTargetChange = jest.fn();
  render(
    <GraphToolbar
      isReverseMode={true}
      derivativeTarget={null}
      nodeIds={nodeIds}
      nodeNames={nodeNames}
      onReverseModeChange={handleReverseModeChange}
      onDerivativeTargetChange={handleDerivativeTargetChange}
    />,
  );

  const derivativeTargetAutocomplete = screen.getByTestId("derivative-target");
  const input = within(derivativeTargetAutocomplete).getByRole("combobox");
  expect(input).toHaveValue("");
});

test("should show the current derivative target", () => {
  const nodeIds: string[] = ["1", "2", "3"];
  const nodeNames: string[] = ["v_1", "v_2", "v_3"];
  const handleReverseModeChange = jest.fn();
  const handleDerivativeTargetChange = jest.fn();
  render(
    <GraphToolbar
      isReverseMode={true}
      derivativeTarget="2"
      nodeIds={nodeIds}
      nodeNames={nodeNames}
      onReverseModeChange={handleReverseModeChange}
      onDerivativeTargetChange={handleDerivativeTargetChange}
    />,
  );

  const derivativeTargetAutocomplete = screen.getByTestId("derivative-target");
  const input = within(derivativeTargetAutocomplete).getByRole("combobox");
  expect(input).toHaveValue("v_2");
});

test("should trigger event when switching differentiation mode", () => {
  const nodeIds: string[] = ["1", "2", "3"];
  const nodeNames: string[] = ["v_1", "v_2", "v_3"];
  const handleReverseModeChange = jest.fn();
  const handleDerivativeTargetChange = jest.fn();
  render(
    <GraphToolbar
      isReverseMode={true}
      derivativeTarget="2"
      nodeIds={nodeIds}
      nodeNames={nodeNames}
      onReverseModeChange={handleReverseModeChange}
      onDerivativeTargetChange={handleDerivativeTargetChange}
    />,
  );

  const toggleSwitch = screen.getByLabelText("toggle-differentiation-mode");
  fireEvent.click(toggleSwitch);
  expect(handleReverseModeChange).toHaveBeenCalledWith(false);
});

test("should trigger event when changing derivative target", () => {
  const nodeIds: string[] = ["1", "2", "3"];
  const nodeNames: string[] = ["v_1", "v_2", "v_3"];
  const handleReverseModeChange = jest.fn();
  const handleDerivativeTargetChange = jest.fn();
  render(
    <GraphToolbar
      isReverseMode={true}
      derivativeTarget="2"
      nodeIds={nodeIds}
      nodeNames={nodeNames}
      onReverseModeChange={handleReverseModeChange}
      onDerivativeTargetChange={handleDerivativeTargetChange}
    />,
  );

  const derivativeTargetAutocomplete = screen.getByTestId("derivative-target");
  const input = within(derivativeTargetAutocomplete).getByRole("combobox");

  fireEvent.click(derivativeTargetAutocomplete);
  fireEvent.change(input, { target: { value: "v_3" } });
  fireEvent.keyDown(derivativeTargetAutocomplete, { key: "ArrowDown" });
  fireEvent.keyDown(derivativeTargetAutocomplete, { key: "Enter" });

  expect(handleDerivativeTargetChange).toHaveBeenCalledWith("3");
});
