import { fireEvent, render, screen, within } from "@testing-library/react";
import type NodeData from "../features/NodeData";
import InputItems from "./InputItems";

jest.mock("../latex/Katex");

jest.mock("reactflow", () => ({
  ...jest.requireActual("reactflow"),
  Handle: () => <div />,
}));

test("should trigger event when changing the input value", () => {
  const data: NodeData = {
    name: "a_1",
    operationData: {
      name: "Add",
      helpText: "Add two numbers $ a + b $",
    },
    featureNodeType: { nodeType: "OPERATION", operationId: "op1" },
    inputItems: [
      {
        id: "a",
        label: "a",
        showHandle: true,
        showInputField: true,
        value: "0",
      },
    ],
    outputItems: [
      {
        type: "VALUE",
        labelParts: [{ type: "text", id: "equal", text: "=" }],
        value: "0",
      },
    ],
    onNameChange: jest.fn(),
    onInputChange: jest.fn(),
    onBodyClick: jest.fn(),
    onDerivativeClick: jest.fn(),
    isDarkMode: false,
    isHighlighted: false,
  };
  const handleInputChange = jest.fn();
  render(
    <InputItems
      id="0"
      data={data}
      itemHeight={10}
      inputWidth={10}
      handleLeftOffset={"-0px"}
      handleSize={10}
      handleColor={"black"}
      handleHoverColor={"black"}
      handleBorderColor={"black"}
      onInputChange={handleInputChange}
    />,
  );

  const inputField = screen.getByTestId("input-item-0-a");
  const input = within(inputField).getByRole("textbox");
  fireEvent.change(input, { target: { value: "3" } });
  expect(handleInputChange).toBeCalledWith("a", "3");
});
