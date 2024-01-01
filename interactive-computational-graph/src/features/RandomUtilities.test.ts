import { randomInteger } from "./RandomUtilities";

test("should generate random numbers", () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.5);

  expect(randomInteger(0, 0)).toBe(0);
  expect(randomInteger(0, 1)).toBe(1);
  expect(randomInteger(0, 9)).toBe(5);

  jest.restoreAllMocks();
});
