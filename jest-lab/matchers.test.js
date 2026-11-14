// รวม Matchers ทุกตัวที่ใช้บ่อย (ทุกบรรทัดผ่านการรันจริง)

describe("Equality", () => {
  test("toBe - primitive (===)", () => {
    expect(2 + 3).toBe(5);
    expect("admin").toBe("admin");
    expect(null).toBe(null);
  });

  test("toEqual - object/array (compare values)", () => {
    expect({ a: 1, b: [1, 2] }).toEqual({ a: 1, b: [1, 2] });
    expect([]).toEqual([]);
  });

  test("toBe fails on objects with same content (different reference)", () => {
    expect({ a: 1 }).not.toBe({ a: 1 });
  });

  test("toStrictEqual - also checks undefined properties", () => {
    expect({ a: 1, b: undefined }).toEqual({ a: 1 });
    expect({ a: 1, b: undefined }).not.toStrictEqual({ a: 1 });
  });
});

describe("Truthiness", () => {
  test("toBeTruthy / toBeFalsy", () => {
    expect("false").toBeTruthy(); // non-empty string
    expect(-5).toBeTruthy();
    expect([]).toBeTruthy();
    expect(0).toBeFalsy();
    expect("").toBeFalsy();
    expect(NaN).toBeFalsy();
  });

  test("toBeNull / toBeUndefined / toBeDefined", () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect(0).toBeDefined();
  });
});

describe("Numbers", () => {
  test("greater / less", () => {
    expect(10).toBeGreaterThan(9);
    expect(10).toBeGreaterThanOrEqual(10);
    expect(5).toBeLessThan(6);
    expect(5).toBeLessThanOrEqual(5);
  });

  test("toBeCloseTo - floating point", () => {
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });
});

describe("Strings / Arrays / Objects", () => {
  test("toMatch - regex or substring", () => {
    expect("Invalid password").toMatch(/invalid/i);
    expect("hello world").toMatch("world");
  });

  test("toContain - item in array / substring", () => {
    expect(["JavaScript", "Python"]).toContain("JavaScript");
    expect("Backend Development").toContain("Backend");
  });

  test("toHaveLength", () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect("abcdefgh").toHaveLength(8);
  });

  test("toHaveProperty", () => {
    const user = { name: "John", address: { city: "Bangkok" } };
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("address.city", "Bangkok");
  });

  test("toContainEqual - object inside array", () => {
    expect([{ id: 1 }, { id: 2 }]).toContainEqual({ id: 2 });
  });
});

describe("Exceptions", () => {
  function parseUser(data) {
    if (data === null) throw new TypeError("data is null");
    return data;
  }

  test("toThrow variants (must wrap in arrow function)", () => {
    expect(() => parseUser(null)).toThrow();
    expect(() => parseUser(null)).toThrow(TypeError);
    expect(() => parseUser(null)).toThrow("data is null");
    expect(() => parseUser(null)).toThrow(/null/);
    expect(() => parseUser({})).not.toThrow();
  });
});
