import { fireEvent, render, screen } from "@testing-library/react";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import ExplainDerivativesPanel from "./ExplainDerivativesPanel";

jest.mock("../latex/Katex");

test("should not render the clear button when the data is empty", () => {
  const handleClearSelection = jest.fn();
  const handleClickLatexLink = jest.fn();
  render(
    <ExplainDerivativesPanel
      hasNodes={true}
      hasDerivativeTarget={true}
      explainDerivativeData={[]}
      onClearSelection={handleClearSelection}
      onClickLatexLink={handleClickLatexLink}
    />,
  );

  const copyIcon = screen.queryByRole("button", { name: "Clear" });
  expect(copyIcon).not.toBeInTheDocument();
});

test("should trigger event when clicking the clear button", () => {
  const data = getExplainDerivativeData();
  const handleClearSelection = jest.fn();
  const handleClickLatexLink = jest.fn();
  render(
    <ExplainDerivativesPanel
      hasNodes={true}
      hasDerivativeTarget={true}
      explainDerivativeData={data}
      onClearSelection={handleClearSelection}
      onClickLatexLink={handleClickLatexLink}
    />,
  );

  const copyIcon = screen.getByRole("button", { name: "Clear" });
  fireEvent.click(copyIcon);
  expect(handleClearSelection).toHaveBeenCalled();
});

test("should trigger event when clicking latex link", async () => {
  const data = getExplainDerivativeData();
  const handleClearSelection = jest.fn();
  const handleClickLatexLink = jest.fn();
  render(
    <ExplainDerivativesPanel
      hasNodes={true}
      hasDerivativeTarget={true}
      explainDerivativeData={data}
      onClearSelection={handleClearSelection}
      onClickLatexLink={handleClickLatexLink}
    />,
  );

  const link = screen.getByRole("link");
  fireEvent.click(link);
  expect(handleClickLatexLink).toHaveBeenCalled();
});

const getExplainDerivativeData = (): ExplainDerivativeData[] => {
  return [
    {
      nodeId: "1",
      nodeName: "v_1",
      items: [
        {
          type: "previousDerivativesReplaced",
          descriptionParts: [
            {
              type: "latexLink",
              id: "chainRuleTerm-v1-0",
              latex: "x",
              href: "v1",
            },
          ],
          latex: "123",
        },
      ],
    },
  ];
};
