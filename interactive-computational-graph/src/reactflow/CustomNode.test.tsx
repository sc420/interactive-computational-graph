import { fireEvent, render, screen } from "@testing-library/react";
import { mockReactFlow } from "../ReactFlowMock";
import type NodeData from "../features/NodeData";
import CustomNode from "./CustomNode";

jest.mock("../latex/Katex");

jest.mock("reactflow", () => ({
  ...jest.requireActual("reactflow"),
  Handle: () => <div />,
}));

beforeAll(() => {
  mockReactFlow();
});

test("should render the custom node", () => {
  const data = getFakeData();
  render(
    <CustomNode
      id="0"
      data={data}
      selected={false}
      type=""
      zIndex={0}
      isConnectable={true}
      xPos={0}
      yPos={0}
      dragging={false}
    />,
  );

  expect(screen.getByText("a")).toBeInTheDocument();
  expect(screen.getByText("=")).toBeInTheDocument();
});

test("should trigger event when clicking the node body", () => {
  const data = getFakeData();
  const handleBodyClick = jest.fn();
  data.onBodyClick = handleBodyClick;
  render(
    <CustomNode
      id="0"
      data={data}
      selected={false}
      type=""
      zIndex={0}
      isConnectable={true}
      xPos={0}
      yPos={0}
      dragging={false}
    />,
  );

  const portLabel = screen.getByText("a");
  fireEvent.click(portLabel);
  expect(handleBodyClick).toBeCalledWith("0");
});

const getFakeData = (): NodeData => {
  return {
    name: "a_1",
    operationData: {
      text: "Add",
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
};
