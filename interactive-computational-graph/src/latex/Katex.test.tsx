import { render } from "@testing-library/react";
import Katex from "./Katex";

test("should render constant", () => {
  const { container } = render(<Katex latex="3.14" />);

  expect(container).toMatchSnapshot();
});

test("should render displaystyle", () => {
  const { container } = render(
    <Katex latex="\displaystyle =\frac{\partial{a}}{\partial{b}} \cdot \frac{\partial{c}}{\partial{d}}" />,
  );

  expect(container).toMatchSnapshot();
});
