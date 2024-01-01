import Port from "./Port";

test("should have correct properties", () => {
  const port = new Port("a", true);
  expect(port.getId()).toBe("a");
  expect(port.isAllowMultiEdges()).toBe(true);
});
