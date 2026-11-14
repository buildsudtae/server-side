// ส่วนเสริม (นอกสไลด์): setup/teardown, async, mock function

describe("beforeEach / afterEach", () => {
  let cart;

  beforeEach(() => {
    cart = []; // reset ก่อนทุก test
  });

  afterEach(() => {
    cart = null;
  });

  test("add item", () => {
    cart.push("Mouse");
    expect(cart).toHaveLength(1);
  });

  test("cart is empty again (reset by beforeEach)", () => {
    expect(cart).toEqual([]);
  });
});

describe("async code", () => {
  function fetchUser(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === 1) resolve({ id: 1, name: "John" });
        else reject(new Error("User not found"));
      }, 10);
    });
  }

  test("async/await", async () => {
    const user = await fetchUser(1);
    expect(user.name).toBe("John");
  });

  test(".resolves", async () => {
    await expect(fetchUser(1)).resolves.toEqual({ id: 1, name: "John" });
  });

  test(".rejects", async () => {
    await expect(fetchUser(99)).rejects.toThrow("User not found");
  });
});

describe("mock function (jest.fn)", () => {
  function processOrder(order, sendEmail) {
    if (order.total > 0) {
      sendEmail(order.email, "Order confirmed");
      return true;
    }
    return false;
  }

  test("should call sendEmail once with correct args", () => {
    const sendEmail = jest.fn();
    processOrder({ total: 100, email: "a@b.com" }, sendEmail);
    expect(sendEmail).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith("a@b.com", "Order confirmed");
  });

  test("should not call sendEmail when total is 0", () => {
    const sendEmail = jest.fn();
    processOrder({ total: 0, email: "a@b.com" }, sendEmail);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  test("mockReturnValue", () => {
    const getPrice = jest.fn().mockReturnValue(500);
    expect(getPrice()).toBe(500);
  });
});
