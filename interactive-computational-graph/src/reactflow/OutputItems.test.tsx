import { render, screen, within } from "@testing-library/react";
import type NodeData from "../features/NodeData";
import OutputItems from "./OutputItems";

jest.mock("../latex/Katex");

jest.mock("reactflow", () => ({
  ...jest.requireActual("reactflow"),
  Handle: () => <div />,
}));

test("should render the output input box as readonly", () => {
  const data: NodeData = {
    name: "a_1",
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
  render(<OutputItems id="0" data={data} itemHeight={10} inputWidth={10} />);

  const inputField = screen.getByTestId("output-item-0-VALUE");
  const input = within(inputField).getByRole("textbox");
  expect(input).toHaveAttribute("readonly");
});
