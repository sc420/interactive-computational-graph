import { render, screen } from "@testing-library/react";
import EditOperationTabPanel from "./EditOperationTabPanel";

test("should render when index == value", () => {
  render(
    <EditOperationTabPanel index={0} value={0}>
      Children
    </EditOperationTabPanel>,
  );

  const tabPanel = screen.getByRole("tabpanel");
  expect(tabPanel).toHaveStyle({ display: "block" });
});

test("should not render when index != value", () => {
  render(
    <EditOperationTabPanel index={0} value={1}>
      Children
    </EditOperationTabPanel>,
  );

  const tabPanel = screen.queryByRole("tabpanel");
  expect(tabPanel).not.toBeInTheDocument();
});
