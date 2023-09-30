import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import ExplainDerivativesPanel from "./ExplainDerivativesPanel";

test("should trigger event when clicking the clear button", () => {
  const data: ExplainDerivativeData[] = [
    {
      nodeId: "v1",
      items: [
        {
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
        },
      ],
    },
  ];
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

test("should copy to clipboard when clicking the copy latex icon", async () => {
  // Mock the writeText function
  const originalNavigator = { ...window.navigator };
  Object.assign(window.navigator, {
    clipboard: {
      writeText: jest.fn(async () => {
        await Promise.resolve();
      }),
    },
  });

  const data: ExplainDerivativeData[] = [
    {
      nodeId: "v1",
      items: [
        {
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
        },
      ],
    },
  ];
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

  const copyIcon = screen.getByRole("button", { name: "copy" });
  fireEvent.click(copyIcon);
  await waitFor(() => {
    // Assert that clipboard.writeText was called with the expected value
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith("123");
  });

  Object.assign(window.navigator, originalNavigator);
});
