const {
  isAdult,
  canEnterConcert,
  canAccessAdmin,
  getGrade,
  divide,
  withdraw,
  getStudent,
} = require("./features");

describe("isAdult", () => {
  it("should return true for age 20", () => {
    expect(isAdult(20)).toBeTruthy();
  });

  it("should return false for age 17", () => {
    expect(isAdult(17)).toBeFalsy();
  });

  // boundary: 17 | 18 | 19
  test.each([
    [17, false],
    [18, true],
    [19, true],
  ])("isAdult(%i) should be %s", (age, expected) => {
    expect(isAdult(age)).toBe(expected);
  });
});

describe("canEnterConcert", () => {
  test("age 14 with ticket -> false", () => {
    expect(canEnterConcert(14, true)).toBe(false);
  });

  test("age 25 without ticket -> false", () => {
    expect(canEnterConcert(25, false)).toBe(false);
  });

  test("age 18 with ticket -> true", () => {
    expect(canEnterConcert(18, true)).toBe(true);
  });
});

describe("canAccessAdmin", () => {
  test("admin -> true", () => {
    expect(canAccessAdmin({ name: "Boss", role: "admin" })).toBe(true);
  });

  test("normal user -> false", () => {
    expect(canAccessAdmin({ name: "Tom", role: "user" })).toBe(false);
  });

  test("no user (null) -> false", () => {
    expect(canAccessAdmin(null)).toBe(false);
  });
});

describe("getGrade", () => {
  test.each([
    [100, "A"],
    [80, "A"],
    [79, "B"],
    [70, "B"],
    [69, "C"],
    [60, "C"],
    [59, "D"],
    [50, "D"],
    [49, "F"],
    [0, "F"],
  ])("getGrade(%i) -> %s", (score, grade) => {
    expect(getGrade(score)).toBe(grade);
  });

  test("score 150 should throw RangeError", () => {
    expect(() => getGrade(150)).toThrow(RangeError);
  });

  test("score -1 should throw with message", () => {
    expect(() => getGrade(-1)).toThrow("Score must be between 0 and 100");
  });
});

describe("divide", () => {
  test("10 / 2 = 5", () => {
    expect(divide(10, 2)).toBe(5);
  });

  test("divide by zero should throw", () => {
    expect(() => divide(10, 0)).toThrow();
    expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
  });
});

describe("withdraw (ATM max 20,000)", () => {
  test("withdraw 5,000 from 30,000 -> 25,000 (positive)", () => {
    expect(withdraw(30000, 5000)).toBe(25000);
  });

  test("withdraw 20,000 exactly (boundary) -> ok", () => {
    expect(withdraw(30000, 20000)).toBe(10000);
  });

  test("withdraw 25,000 -> throw (negative)", () => {
    expect(() => withdraw(30000, 25000)).toThrow("Maximum 20,000 per transaction");
  });

  test("withdraw more than balance -> throw", () => {
    expect(() => withdraw(1000, 1500)).toThrow("Insufficient balance");
  });
});

describe("getStudent (object -> toEqual)", () => {
  test("should return student object", () => {
    expect(getStudent()).toEqual({ name: "Alice", subjects: ["Math", "Programming"] });
  });

  test("subjects should contain Programming", () => {
    expect(getStudent().subjects).toContain("Programming");
  });
});
