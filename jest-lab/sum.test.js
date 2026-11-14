const sum = require("./sum");

test("2 + 3 = 5", () => {
  expect(sum(2, 3)).toBe(5);
});

test("5 + 5 = 10", () => {
  expect(sum(5, 5)).toBe(10);
});

test("-1 + 1 = 0", () => {
  expect(sum(-1, 1)).toBe(0);
});
