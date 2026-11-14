const validateUsername = require("./validateUsername");

describe("validateUsername", () => {
  // Positive Test Cases
  test("should accept a username with minimum length of 5 characters", () => {
    expect(validateUsername("john1")).toBe(true);
  });

  test("should accept a username containing underscore", () => {
    expect(validateUsername("john_doe")).toBe(true);
  });

  test("should accept letters, numbers, and underscore", () => {
    expect(validateUsername("User_123")).toBe(true);
  });

  test("should accept letters and numbers", () => {
    expect(validateUsername("abcde12345")).toBe(true);
  });

  test("should accept a username with maximum length of 20 characters", () => {
    expect(validateUsername("abcdefghijklmnopqrst")).toBe(true);
  });

  // Negative Test Cases
  test("should reject a username shorter than 5 characters", () => {
    expect(validateUsername("john")).toBe(false);
  });

  test("should reject a username longer than 20 characters", () => {
    expect(validateUsername("abcdefghijklmnopqrstu")).toBe(false);
  });

  test("should reject a username starting with a number", () => {
    expect(validateUsername("1john")).toBe(false);
  });

  test("should reject a username containing spaces", () => {
    expect(validateUsername("john doe")).toBe(false);
  });

  test("should reject a username containing special characters", () => {
    expect(validateUsername("john@123")).toBe(false);
  });
});
