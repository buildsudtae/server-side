const validatePassword = require("./validatePassword");

describe("validatePassword - boundary value (min 8)", () => {
  test("6 chars -> false", () => {
    expect(validatePassword("abcdef")).toBe(false);
  });

  test("7 chars -> false (just below boundary)", () => {
    expect(validatePassword("abcdefg")).toBe(false);
  });

  test("8 chars -> true (exact boundary)", () => {
    expect(validatePassword("abcdefgh")).toBe(true);
  });

  test("9 chars -> true (just above boundary)", () => {
    expect(validatePassword("abcdefghi")).toBe(true);
  });

  test("10 chars -> true", () => {
    expect(validatePassword("abcdefghij")).toBe(true);
  });
});

describe("validatePassword - negative / invalid input", () => {
  test("null -> false", () => {
    expect(validatePassword(null)).toBe(false);
  });

  test("number 12345 -> false", () => {
    expect(validatePassword(12345)).toBe(false);
  });

  test("empty string -> false", () => {
    expect(validatePassword("")).toBe(false);
  });
});
