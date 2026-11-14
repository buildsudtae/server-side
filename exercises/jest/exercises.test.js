const { isPalindrome, calculateBMI, calculateShipping } = require("./exercises");

describe("isPalindrome", () => {
  test.each([
    ["racecar", true],
    ["Level", true],
    ["A man, a plan, a canal: Panama", true],
    ["hello", false],
  ])("isPalindrome(%p) -> %p", (input, expected) => {
    expect(isPalindrome(input)).toBe(expected);
  });

  test("non-string should throw TypeError", () => {
    expect(() => isPalindrome(123)).toThrow(TypeError);
  });
});

describe("calculateBMI", () => {
  test("70kg 1.75m -> about 22.86", () => {
    expect(calculateBMI(70, 1.75)).toBeCloseTo(22.86, 2);
  });

  test("height 0 should throw", () => {
    expect(() => calculateBMI(70, 0)).toThrow("Invalid input");
  });
});

describe("calculateShipping (boundary 1000)", () => {
  test.each([
    [999, 50],
    [1000, 0],
    [1001, 0],
    [0, 50],
  ])("total %i -> shipping %i", (total, fee) => {
    expect(calculateShipping(total)).toBe(fee);
  });

  test("negative total -> RangeError", () => {
    expect(() => calculateShipping(-1)).toThrow(RangeError);
  });
});
