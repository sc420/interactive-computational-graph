import { fireEvent, render, screen } from "@testing-library/react";
import type ExplainDerivativeItem from "../features/ExplainDerivativeItem";
import ExplainDerivativesListItem from "./ExplainDerivativeListItem";

jest.mock("../latex/Katex");

test("should trigger event when clicking the copy latex icon", () => {
  const item: ExplainDerivativeItem = {
    type: "previousDerivativesReplaced",
    descriptionParts: [
      {
        type: "latexLink",
        id: "chainRuleTerm-v1",
        latex: "x",
        href: "v1",
      },
    ],
    latex: "123",
  };
  const handleCopyLatex = jest.fn();
  const handleClickLatexLink = jest.fn();
  render(
    <ExplainDerivativesListItem
      item={item}
      hasDivider={false}
      onCopyLatex={handleCopyLatex}
      onClickLatexLink={handleClickLatexLink}
    />,
  );

  const copyIcon = screen.getByRole("button", { name: "copy" });
  fireEvent.click(copyIcon);
  expect(handleCopyLatex).toHaveBeenCalledWith("123");
});

test("should trigger event when clicking the latex link", () => {
  const item: ExplainDerivativeItem = {
    type: "previousDerivativesReplaced",
    descriptionParts: [
      {
        type: "latexLink",
        id: "chainRuleTerm-v1",
        latex: "x",
        href: "v1",
      },
    ],
    latex: "123",
  };
  const handleCopyLatex = jest.fn();
  const handleClickLatexLink = jest.fn();
  render(
    <ExplainDerivativesListItem
      item={item}
      hasDivider={false}
      onCopyLatex={handleCopyLatex}
      onClickLatexLink={handleClickLatexLink}
    />,
  );

  const link = screen.getByRole("link");
  fireEvent.click(link);
  expect(handleClickLatexLink).toHaveBeenCalledWith("v1");
});
