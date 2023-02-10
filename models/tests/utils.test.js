import { getRandomCoords, isNumber } from "../utils";

describe("isNumber()", () => {
  test("Returns true when the argument is a number", () => {
    expect(isNumber(50)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(24)).toBe(true);
    expect(isNumber(-5)).toBe(true);
  });

  test("Returns false when the argument is not a number", () => {
    expect(isNumber("I'm Batman")).toBe(false);
    expect(isNumber("")).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber([5])).toBe(false);
    expect(isNumber({ 5: 0 })).toBe(false);
    expect(isNumber("32")).toBe(false);
    expect(isNumber("0")).toBe(false);
  });

  test("Returns false for 'NaN'", () => {
    expect(isNumber(NaN)).toBe(false);
  });
});

describe("getRandomCoords()", () => {
  test("Returns an array of length 2", () => {
    expect(getRandomCoords(9)).toBeInstanceOf(Array);
    expect(getRandomCoords(9)).toHaveLength(2);
  });

  test(`Generates random coords between zero (inclusive)
    and the given argument (inclusive)`, () => {
    for (let i = 0; i < 10; i++) {
      const result = getRandomCoords(9);
      expect(result[0]).toBeGreaterThanOrEqual(0);
      expect(result[0]).toBeLessThanOrEqual(9);
      expect(result[1]).toBeGreaterThanOrEqual(0);
      expect(result[1]).toBeLessThanOrEqual(9);
    }
  });
});
