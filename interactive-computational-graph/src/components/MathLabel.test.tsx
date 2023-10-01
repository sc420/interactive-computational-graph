import { fireEvent, render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import type MathLabelPartType from "../features/MathLabelPartType";
import MathLabel from "./MathLabel";

jest.mock("../latex/Katex");

test("should render correctly with mixed types", () => {
  const parts: MathLabelPartType[] = [
    {
      type: "text",
      id: "id1",
      text: "To calculate ",
    },
    {
      type: "latex",
      id: "id2",
      latex: "x",
    },
    {
      type: "text",
      id: "id3",
      text: ", we need to calculate ",
    },
    {
      type: "latexLink",
      id: "id4",
      latex: "\\frac{a}{b}",
      href: "123",
    },
  ];
  const handleClickLatexLink = jest.fn();
  const tree = renderer
    .create(<MathLabel parts={parts} onClickLatexLink={handleClickLatexLink} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("should trigger event when clicking the latex link", () => {
  const parts: MathLabelPartType[] = [
    {
      type: "latexLink",
      id: "link",
      latex: "\\frac{a}{b}",
      href: "123",
    },
  ];
  const handleClickLatexLink = jest.fn();
  render(<MathLabel parts={parts} onClickLatexLink={handleClickLatexLink} />);

  const latexLink = screen.getByRole("link");
  fireEvent.click(latexLink);
  expect(handleClickLatexLink).toHaveBeenCalledWith("123");
});
