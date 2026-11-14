# คู่มือทำแลปทีละขั้น — Jest · API Testing · MVC · Cookies

ขั้นตอนทำทั้ง 4 แลป **ตั้งแต่โฟลเดอร์ว่างตามลำดับสไลด์** (ไม่มีทฤษฎี — ทฤษฎีอยู่ในเล่มสรุป) ทุกขั้นมี:

1. **คำสั่ง** ที่ต้องพิมพ์
2. **โค้ดเต็ม** ที่ copy ไปวางได้ทันที
3. ✅ **จุดเช็ค** — วิธีทดสอบ และผลที่ต้องเห็น ถ้าไม่ตรงให้หยุดแก้ก่อนไปขั้นถัดไป

ท้ายแต่ละแลปมี **Exercise / Assignment ในสไลด์** และ **โจทย์ประยุกต์ (จากเล่มสรุป)** พร้อมวิธีทำและเฉลย

> 🧪 โค้ดทุกบล็อกในไฟล์นี้ถูกสร้างจากไฟล์ที่รันทดสอบจริงแล้ว และมีการ "ทำตามคู่มือนี้ทีละขั้นในโฟลเดอร์ว่าง" อัตโนมัติจนผ่านทุกจุดเช็ค (Node.js 22, Express 5, Jest 30, MySQL/MariaDB, Chrome) ถ้าหลงทาง เทียบกับโฟลเดอร์ใน `tested-code.zip` ได้

## สารบัญ

- [0. เตรียมเครื่อง (ทำครั้งเดียว)](#0-เตรียมเครื่อง-ทำครั้งเดียว)
- [แลป 1 · Unit Testing with Jest](#แลป-1--unit-testing-with-jest)
- [แลป 2 · API Testing (Postman)](#แลป-2--api-testing-postman)
- [แลป 3 · MVC + EJS](#แลป-3--mvc--ejs)
- [แลป 4 · Cookies (Project I + Project II)](#แลป-4--cookies-project-i--project-ii)
- [ภาคผนวก: ปัญหาที่เจอบ่อย](#ภาคผนวก-ปัญหาที่เจอบ่อย)

---

## 0. เตรียมเครื่อง (ทำครั้งเดียว)

| โปรแกรม | ใช้ในแลป | วิธีติดตั้ง |
|---|---|---|
| **Node.js (LTS)** | ทุกแลป | เข้า https://nodejs.org → กดปุ่ม **LTS** → รันไฟล์ `.msi` → Next ไปเรื่อย ๆ (ติ๊ก "Add to PATH" ค้างไว้) |
| **VS Code** | ทุกแลป | https://code.visualstudio.com |
| Extension **Live Server** (Ritwick Dey) | แลป 4 | VS Code → ไอคอน Extensions (Ctrl+Shift+X) → ค้นหา "Live Server" → Install |
| Extension **REST Client** (Huachao Mao) | แลป 3, 4 | ค้นหา "REST Client" → Install |
| **Docker Desktop** | แลป 3 | https://www.docker.com/products/docker-desktop → ติดตั้ง (ใช้ WSL 2) → เปิดโปรแกรมทิ้งไว้ให้ขึ้น "Engine running" |
| **Git for Windows** (มี Git Bash) | แลป 4 (โจทย์ curl) | https://git-scm.com |
| บัญชี **GitHub** + **Postman** (เว็บ) | แลป 2 | https://github.com และ https://web.postman.co (สมัครฟรี) |

เปิด terminal (ใน VS Code กด <kbd>Ctrl</kbd> + <kbd>`</kbd>) แล้วเช็คเวอร์ชัน:

```powershell
node -v      # ควรได้ v22.x ขึ้นไป
npm -v       # 10.x
docker -v    # (เฉพาะแลป 3)
```

> ⚠️ ถ้า PowerShell ขึ้น `npm.ps1 cannot be loaded because running scripts is disabled on this system` ให้รันคำสั่งนี้ครั้งเดียวแล้วปิด-เปิด terminal ใหม่:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**กติกาทั่วไป**

- 1 แลป = 1 โฟลเดอร์ เปิดใน VS Code ด้วย `code .` หรือ File → Open Folder
- สร้างไฟล์ใหม่: แถบ Explorer ซ้าย → ไอคอน New File → ตั้งชื่อ **ให้ตรงตัวอักษร** (ตัวพิมพ์เล็ก-ใหญ่มีผล)
- server ที่รันค้าง (`node ...`) หยุดด้วย <kbd>Ctrl</kbd> + <kbd>C</kbd> ใน terminal นั้น — ทุกแลปใช้ port 3000 ต้องหยุดตัวเก่าก่อนรันตัวใหม่
- คำสั่งในคู่มือนี้พิมพ์ใน **PowerShell** (terminal ปกติของ VS Code บน Windows)

---

## แลป 1 · Unit Testing with Jest

สไลด์ 10

### 1.1 สร้างโปรเจค (สไลด์ "Setup")

```powershell
mkdir my-testing
cd my-testing
npm init -y
npm install -D jest
code .
```

เปิด `package.json` แก้ส่วน `"scripts"` จาก `"test": "echo \"Error: no test specified\" && exit 1"` ให้เป็น `"test": "jest"` (หรือพิมพ์คำสั่ง `npm pkg set scripts.test=jest` แทนการแก้มือ):

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

> ✅ **จุดเช็ค:** พิมพ์ `npm test` ตอนนี้จะได้ `No tests found, exiting with code 1` — ปกติ เพราะยังไม่มีไฟล์ test

### 1.2 เทสแรก: `sum.js` + `sum.test.js`

สร้าง 2 ไฟล์ในโฟลเดอร์ `my-testing`:

📄 **ไฟล์ `sum.js`**

```js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

📄 **ไฟล์ `sum.test.js`**

```js
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
```

```powershell
npm test
```

> ✅ **จุดเช็ค:** ต้องเห็น
> ```
> PASS ./sum.test.js
> Test Suites: 1 passed, 1 total
> Tests:       3 passed, 3 total
> ```

### 1.3 AAA Pattern: `calculateDiscount`

📄 **ไฟล์ `calculateDiscount.js`**

```js
function calculateDiscount(price, member) {
  if (member) {
    return price * 0.9;
  }
  return price;
}

module.exports = calculateDiscount;
```

📄 **ไฟล์ `calculateDiscount.test.js`**

```js
const calculateDiscount = require("./calculateDiscount");

test("member should receive 10% discount", () => {
  // Arrange
  const price = 1000;
  const member = true;

  // Act
  const result = calculateDiscount(price, member);

  // Assert
  expect(result).toBe(900);
});

test("non-member should pay full price", () => {
  // Arrange
  const price = 1000;
  const member = false;

  // Act
  const result = calculateDiscount(price, member);

  // Assert
  expect(result).toBe(1000);
});
```

```powershell
npm test
```

> ✅ **จุดเช็ค:** `Test Suites: 2 passed` และ `Tests: 5 passed, 5 total`

### 1.4 Test Case Design: `validateUsername` + `describe()`

**Requirement (สไลด์):** Username must contain 5–20 characters, contain only letters, numbers, and underscore, must not contain spaces, and must start with a letter.

Test case ที่ต้องเขียน (ตารางในสไลด์):

| No | Input | Test Case | Expected |
|---|---|---|---|
| P1 | `"john1"` | Minimum length of 5 characters | true |
| P2 | `"john_doe"` | Contains underscore | true |
| P3 | `"User_123"` | Letters + Numbers + Underscore | true |
| P4 | `"abcde12345"` | Letters and Numbers | true |
| P5 | `"abcdefghijklmnopqrst"` | Maximum length of 20 characters | true |
| N1 | `"john"` | Only 4 characters | false |
| N2 | `"abcdefghijklmnopqrstu"` | 21 characters | false |
| N3 | `"1john"` | Starts with a number | false |
| N4 | `"john doe"` | Contains a space | false |
| N5 | `"john@123"` | Contains invalid character | false |

📄 **ไฟล์ `validateUsername.js`**

```js
function validateUsername(username) {
  // Username must be a string
  if (typeof username !== "string") {
    return false;
  }

  // Length must be between 5 and 20 characters
  if (username.length < 5 || username.length > 20) {
    return false;
  }

  // Must start with a letter (Regex)
  if (!/^[A-Za-z]/.test(username)) {
    return false;
  }

  // Only letters, numbers, underscore, and no space are allowed
  if (!/^[A-Za-z0-9_]+$/.test(username)) {
    return false;
  }

  return true;
}

module.exports = validateUsername;
```

📄 **ไฟล์ `validateUsername.test.js`**

```js
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
```

```powershell
npm test
npx jest validateUsername --verbose
```

> ✅ **จุดเช็ค:** `npm test` → `Tests: 15 passed` และ `npx jest validateUsername --verbose` แสดงชื่อ test ทั้ง 10 ข้อพร้อมเครื่องหมาย ✓

### 1.5 Boundary Value: `validatePassword`

**Requirement:** Password must contain at least 8 characters. (ทดสอบขอบ 6 | 7 | **8** | 9 | 10)

📄 **ไฟล์ `validatePassword.js`**

```js
// Requirement: Password must contain at least 8 characters.
// Code II (ถูกต้อง) ใช้ >= ; Code I ในสไลด์ใช้ > ซึ่งผิดที่ boundary 8 ตัว
function validatePassword(password) {
  if (typeof password !== "string") {
    return false;
  }
  return password.length >= 8;
}

module.exports = validatePassword;
```

📄 **ไฟล์ `validatePassword.test.js`**

```js
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
```

```powershell
npm test
```

> ✅ **จุดเช็ค:** `Tests: 23 passed, 23 total`

**ทดลองให้เห็นบั๊ก Code I ของสไลด์:** แก้บรรทัด `return password.length >= 8;` เป็น `> 8` แล้วรัน `npx jest validatePassword` จะเห็น

```
● validatePassword - boundary value (min 8) › 8 chars -> true (exact boundary)
    Expected: true
    Received: false
```

ดูแล้ว **แก้กลับเป็น `>=`**

### 1.6 คำสั่ง Jest ที่ควรรู้

| คำสั่ง | ผล |
|---|---|
| `npm test` | รันทุกไฟล์ `*.test.js` |
| `npx jest sum` | รันเฉพาะไฟล์ที่ชื่อมีคำว่า sum |
| `npx jest --verbose` | แสดงชื่อทุก test |
| `npx jest --coverage` | รายงาน % ของโค้ดที่ถูกทดสอบ (สร้างโฟลเดอร์ `coverage/`) |
| `npx jest --watchAll` | รันใหม่อัตโนมัติเมื่อแก้ไฟล์ (กด q เพื่อออก) — `--watch` เฉย ๆ ใช้ได้เฉพาะโฟลเดอร์ที่เป็น git repo |

### 1.7 Exercise ในสไลด์

#### Project Work: นำเสนอผลการทดสอบอย่างน้อย 5 features

ตัวอย่างฉบับเต็ม 7 ฟังก์ชัน (สร้าง 2 ไฟล์):

📄 **ไฟล์ `features.js`**

```js
// ===== ฉบับรวม: ฟังก์ชันตัวอย่างสำหรับ Project Work (>= 5 features) =====

function isAdult(age) {
  return age >= 18;
}

function canEnterConcert(age, ticket) {
  return age >= 18 && ticket;
}

function canAccessAdmin(user) {
  if (!user) {
    return false;
  }
  return user.role === "admin";
}

function getGrade(score) {
  if (typeof score !== "number" || score < 0 || score > 100) {
    throw new RangeError("Score must be between 0 and 100");
  }
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

function withdraw(balance, amount) {
  if (amount > 20000) {
    throw new Error("Maximum 20,000 per transaction");
  }
  if (amount > balance) {
    throw new Error("Insufficient balance");
  }
  return balance - amount;
}

function getStudent() {
  return { name: "Alice", subjects: ["Math", "Programming"] };
}

module.exports = {
  isAdult,
  canEnterConcert,
  canAccessAdmin,
  getGrade,
  divide,
  withdraw,
  getStudent,
};
```

📄 **ไฟล์ `features.test.js`**

```js
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
```

```powershell
npm test
```

> ✅ **จุดเช็ค:** `Test Suites: 5 passed` · `Tests: 54 passed, 54 total` — นำผลนี้ (หรือ `npx jest --verbose`) ไปทำตารางสรุปผลการทดสอบใน Project Work ได้เลย

### 1.8 โจทย์ประยุกต์ (จากเล่มสรุป) + เฉลย

**โจทย์:**
1. `isPalindrome(text)` อ่านกลับหลังเหมือนเดิม ไม่สนตัวพิมพ์เล็ก-ใหญ่/ช่องว่าง/เครื่องหมาย ถ้าไม่ใช่ string ให้ throw `TypeError`
2. `calculateBMI(weight, height)` = น้ำหนัก ÷ ส่วนสูง² ถ้าค่า ≤ 0 ให้ throw `"Invalid input"`
3. `calculateShipping(total)` ยอด ≥ 1000 ส่งฟรี (0) น้อยกว่านั้น 50 บาท ยอดติดลบ throw `RangeError`

**เฉลย:**

📄 **ไฟล์ `exercises.js`**

```js
// แบบฝึก 1: isPalindrome
function isPalindrome(text) {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === clean.split("").reverse().join("");
}

// แบบฝึก 2: calculateBMI = weight(kg) / height(m)^2
function calculateBMI(weight, height) {
  if (weight <= 0 || height <= 0) {
    throw new Error("Invalid input");
  }
  return weight / (height * height);
}

// แบบฝึก 3: calculateShipping
// ยอดซื้อ >= 1000 ส่งฟรี, น้อยกว่านั้นค่าส่ง 50 บาท, ยอดติดลบให้ throw
function calculateShipping(total) {
  if (total < 0) {
    throw new RangeError("Total must not be negative");
  }
  return total >= 1000 ? 0 : 50;
}

module.exports = { isPalindrome, calculateBMI, calculateShipping };
```

📄 **ไฟล์ `exercises.test.js`**

```js
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
```

```powershell
npx jest exercises
```

> ✅ **จุดเช็ค:** `Tests: 12 passed, 12 total`

---

## แลป 2 · API Testing (Postman)

สไลด์ 11 · ใช้ **curl** + **Postman** ยิงไปที่แอป **ToDo App** (repo `djwester/todo-list-testing`) บน **GitHub Codespaces** — ไม่ต้องเขียนโค้ดเซิร์ฟเวอร์

### 2.1 Exercise: เรียก API ด้วย curl

Windows 10/11 มี `curl.exe` ติดมาแล้ว — **ใน PowerShell ให้พิมพ์ `curl.exe`** (เพราะ `curl` เฉย ๆ ใน PowerShell คือคำสั่งอื่น) หรือใช้ Command Prompt / Git Bash พิมพ์ `curl` ได้เลย

```powershell
curl.exe -H "Accept: application/json" https://icanhazdadjoke.com/
curl.exe -H "Accept: text/plain" https://icanhazdadjoke.com/
curl.exe https://randomuser.me/api/
curl.exe https://pokeapi.co/api/v2/pokemon/pikachu
curl.exe https://httpbin.org/get
curl.exe https://dog.ceo/api/breeds/image/random
```

**สิ่งที่ต้องสังเกต:**
- icanhazdadjoke ส่งรูปแบบตาม header **`Accept`**: `application/json` ได้ `{"id":"...","joke":"...","status":200}`, `text/plain` ได้ข้อความล้วน — ถ้า curl ไม่ใส่ Accept จะได้ text/plain (เว็บเบราว์เซอร์ได้ HTML)
- API อื่น ๆ ตอบเป็น **JSON** — randomuser สุ่มคนใหม่ทุกครั้ง, pokeapi ได้ข้อมูล pikachu ยาวมาก, httpbin สะท้อน header ที่เราส่งไป, dog.ceo ได้ URL รูปหมา
- เพิ่ม `-i` เพื่อดู status line และ response headers เช่น `curl.exe -i https://httpbin.org/get`

### 2.2 เริ่มใช้ Postman + ประเภท API (REST / SOAP / GraphQL)

1. เข้า https://web.postman.co → สมัคร/ล็อกอิน (แลปนี้ไม่ต้องติดตั้งโปรแกรม) → **New → HTTP**
2. **REST:** GET `https://api.mathjs.org/v4/?expr=2*(7-3)` → Send → ได้ `8` (ลองใส่ expr อื่นที่แท็บ **Params** ได้)
3. **SOAP:** เมธอด **POST** URL `http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso` → **Headers** เพิ่ม `Content-Type` = `application/soap+xml` → **Body → raw → XML** วาง:

```xml
<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <ListOfCountryNamesByName xmlns="http://www.oorsprong.org/websamples.countryinfo">
    </ListOfCountryNamesByName>
  </soap12:Body>
</soap12:Envelope>
```

   → Send → ได้ XML รายชื่อประเทศ
4. **GraphQL:** POST `https://countries.trevorblades.com/graphql` → **Body → GraphQL** → ช่อง QUERY วาง:

```graphql
query {
  country(code: "TH") {
    name
    native
    capital
    currency
    languages {
      code
      name
    }
  }
}
```

   → Send → ได้ข้อมูลประเทศไทยเฉพาะ field ที่ขอ

### 2.3 เปิดแอป ToDo บน GitHub Codespaces

1. เข้า https://github.com/djwester/todo-list-testing → ปุ่มเขียว **Code** → แท็บ **Codespaces** → **Create codespace on main** (รอ 1–3 นาที)
2. ใน Terminal ของ Codespaces พิมพ์:

```bash
make run-dev
```

   ต้องเห็น `Uvicorn running on http://127.0.0.1:8000` และ `Application startup complete.`
3. มี popup มุมขวาล่าง → กด **Make Public** (ถ้าพลาด: แท็บ **Ports** → คลิกขวาแถว 8000 → **Port Visibility → Public**)
4. แท็บ Ports → copy **Forwarded Address** เช่น `https://curly-carnival-xxxx-8000.app.github.dev` = **`<base-url>`** (ไม่ต้องมี `/` ปิดท้าย)
5. เปิด `<base-url>` ใน browser → กด **Continue** ที่หน้าเตือน "You are about to access a development port" → เห็นหน้า **ToDo App**

> ⚠️ Codespace จะหลับเองเมื่อไม่ได้ใช้ และ **URL เปลี่ยนทุกครั้งที่เปิดใหม่** — ใน Postman ให้สร้างตัวแปร `baseUrl` (ไอคอน Environment หรือ Collection → Variables) แล้วใช้ `{{baseUrl}}/tasks` จะแก้ URL ที่เดียว

### 2.4 ดู request จริงด้วย Chrome DevTools

บนหน้า ToDo App กด <kbd>F12</kbd> → แท็บ **Network** → พิมพ์ข้อความแล้วกด **Add** → คลิก request ชื่อ `tasks`:
- **Headers:** `Request Method: POST`, `Request URL: <base-url>/tasks`, `Status Code: 201`
- **Payload:** `{"description":"hello welcome welcome","status":"Draft","created_by":"anonymous"}`
- **Response:** `{"description":"...","status":"Draft","created_by":"anonymous","id":1}`

= เราได้ "สูตร" ที่ต้องส่งใน Postman แล้ว

### 2.5 ส่ง request ใน Postman ทีละแบบ

| ขั้น | Method + URL | Body / ตั้งค่า | ผลที่ต้องเห็น |
|---|---|---|---|
| สร้าง task | POST `{{baseUrl}}/tasks` | Body → raw → **JSON**: `{"description": "Learn Coding", "status": "Draft", "created_by": "anonymous"}` | **201 Created** + task พร้อม `id` |
| ดู task | GET `{{baseUrl}}/tasks/2` | – | `{"description":"Learn Coding","status":"Draft"}` |
| แก้ task | PUT `{{baseUrl}}/tasks/2` | JSON `{"description": "Learn Coding", "status": "In Progress", "created_by": "anonymous"}` (**ต้องพิมพ์ status ให้ตรงเป๊ะ**) | 200 status เปลี่ยน |
| ลบ (ยังไม่ login) | DELETE `{{baseUrl}}/tasks/2` | – | **401** `{"detail":"Not authenticated"}` = ต้องการลบแต่ไม่มี Authenticated |

ค่า `status` ที่ระบบยอมรับมีแค่ `"Draft"`, `"In Progress"`, `"Complete"` — ส่งค่าอื่นจะได้ **422**

### 2.6 API Discovery Challenge + Login

1. เปิด `<base-url>/docs` = หน้า **Swagger (FastAPI)** แสดงทุก endpoint — กดแต่ละอันดูพารามิเตอร์/ตัวอย่าง response
2. ดู `POST /token` → ต้องส่งแบบ **`application/x-www-form-urlencoded`** ฟิลด์ `username`, `password`
3. Postman: POST `{{baseUrl}}/token` → **Body → x-www-form-urlencoded** → `username` = `user1`, `password` = `12345` → Send → ได้
   `{"access_token": "eyJhbGciOi...", "token_type": "bearer"}` → **copy ค่า access_token**
4. request ใหม่ GET `{{baseUrl}}/user/me` → แท็บ **Authorization** → Auth Type = **Bearer Token** → วาง token → Send → `{"username": "user1"}`

> 💡 ถ้าส่ง `/token` เป็น raw JSON จะได้ 422 `Field required` — ต้องเป็น x-www-form-urlencoded เท่านั้น

### 2.7 Assignment (สไลด์): Login ด้วย user ต่าง ๆ

| No | Username | Password |
|---|---|---|
| 1 | user1 | 12345 |
| 2 | user2 | 12345 |
| 3 | anonymous | 12345 |

ทำบนหน้าเว็บ ToDo App (เปิด DevTools → Network ค้างไว้):
1. กด **Login** → ใส่ user1 / 12345 → สังเกต request `token` และ `me` ใน Network
2. **เพิ่ม Task ใหม่** → ดูว่า `created_by` เป็น user1
3. กด **Edit** แก้ข้อความ task → ดู request `PUT /tasks/{id}`
4. เปลี่ยน dropdown status จาก **Draft → In Progress** → จะเห็น request `PUT /tasks/{id}/in-progress` — endpoint นี้ **ไม่มีใน /docs** (There is no documentation for this endpoint) ต้องค้นจาก DevTools เอง
5. Logout แล้ว login เป็น user2 / anonymous ทำซ้ำ

### 2.8 Testing Secure APIs: Basic Auth / Base64

1. GET `https://postman-echo.com/basic-auth` → Authorization → **Basic Auth** → Username `postman` Password `password` → Send → `{"authenticated": true}`
2. ดูแท็บ **Headers (hidden)** ของ request จะเห็น `Authorization: Basic cG9zdG1hbjpwYXNzd29yZA==`
3. นำ `cG9zdG1hbjpwYXNzd29yZA==` ไปถอดที่ https://www.base64decode.org → ได้ `postman:password`

### 2.9 Testing GET calls / Testing PUT calls (ตารางในสไลด์)

login user1 ก่อน (ข้อ 2.6) แล้วใส่ Bearer token ในทุก request ที่ต้อง login

| No | Method | URL | ผลจริง |
|---|---|---|---|
| 1 | GET | `<base-url>/tasks/1` | `{"description": ..., "status": ...}` |
| 2 | GET | `<base-url>/user` | รายชื่อ user ทั้งหมด (ไม่มี password) |
| 3 | GET | `<base-url>/user/user1` | ต้องมี token → `{"id":1,"username":"user1"}` (ไม่มี token = 401) |
| 4 | GET | `<base-url>/user/me` | `{"username":"user1"}` |
| 5 | GET | `<base-url>/tasks?status=In%20Progress` | เฉพาะ task ที่ In Progress (`%20` = ช่องว่าง — ใส่ที่แท็บ **Params** Postman จะแปลงให้) |
| 6 | GET | `<base-url>/tasks?search=Keep` | task ที่ description มีคำว่า Keep |

**PUT ที่น่าสนใจ:**

| ทำอะไร | ผล | สรุป |
|---|---|---|
| PUT `/tasks/1` body ใส่ `"id": 100` | id ยังเป็น 1 | ระบบใช้ id จาก URL (ถูกต้อง) |
| PUT `/user/user1` (token user1) body `{"username":"user1","password":"12345","full_name":"User1 Modified"}` ไม่ใส่ email | `"email": null` | **บั๊ก** — field ที่ไม่ส่งถูกลบ |
| PUT `/user/user2` ด้วย token user1 | **403** `You are not authorized to modify this user` | ถูกต้อง: แก้ของคนอื่นไม่ได้ |
| login user2 → DELETE task ที่ user1 สร้าง | **404** `could not delete task ...` | ถูกต้อง: ลบของคนอื่นไม่ได้ |
| login anonymous → DELETE task ที่ anonymous สร้าง | 200 `{"deleted": true}` | ถูกต้อง |

### 2.10 Assignment (2 points): Break the API — หา 500 errors

เฉลย (ทดสอบกับแอปจริง):

| ลองส่ง | ผล | ทำไมเป็นบั๊ก |
|---|---|---|
| **PUT `/tasks/99999`** (id ที่ไม่มี) body `{"description":"x","status":"Draft"}` | **500 Internal Server Error** | โค้ดใช้ `scalar_one()` ไม่จับกรณีไม่พบ → ควรตอบ 404 |
| PUT `/user/admin` ด้วย token user1 เปลี่ยน password | 200 แล้ว login admin ด้วยรหัสใหม่ได้ | เงื่อนไข `and username != "admin"` ทำให้ใครก็แก้ admin ได้ |
| POST `/tasks` ด้วย `created_by: "nobody"` | 201 | ไม่ตรวจว่ามี user นี้จริง |
| POST `/user` | response มี `pwd` (bcrypt hash) | ไม่ควรส่ง hash กลับ |

### 2.11 โจทย์ประยุกต์ (เล่มสรุป): เขียน Test Script อัตโนมัติใน Postman

ใน request ใดก็ได้ → แท็บ **Scripts → Post-response** วางโค้ด → Send → ดูแท็บ **Test Results**

```javascript
// POST {{baseUrl}}/tasks
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});
pm.test("Task is created as Draft", function () {
    const json = pm.response.json();
    pm.expect(json.description).to.eql("Learn Coding");
    pm.expect(json.status).to.eql("Draft");
    pm.expect(json).to.have.property("id");
    pm.collectionVariables.set("taskId", json.id);   // เก็บ id ไว้ใช้ request ถัดไป
});
```

```javascript
// POST {{baseUrl}}/token  (x-www-form-urlencoded: user1 / 12345)
pm.test("Login success returns access_token", function () {
    pm.response.to.have.status(200);
    const json = pm.response.json();
    pm.expect(json.token_type).to.eql("bearer");
    pm.collectionVariables.set("token", json.access_token);   // request อื่นใช้ Bearer {{token}}
});
```

**ทางลัด:** ใน `tested-code.zip` มีไฟล์ **`postman/todo.postman_collection.json`** (11 requests + test scripts ครบ) → Postman กด **Import** → ลากไฟล์ใส่ → Collection **ToDo API Tests** → แท็บ **Variables** ใส่ `baseUrl` = `<base-url>` → Save → กด **Run** → Run ToDo API Tests

หรือรันจาก terminal ด้วย **newman** (Postman แบบ command line) — อยู่ในโฟลเดอร์ `postman` ของ zip:

```powershell
cd postman
npm install
npx newman run todo.postman_collection.json --env-var baseUrl=https://xxxx-8000.app.github.dev
```

> ✅ **จุดเช็ค:** ตารางสรุปท้ายสุดต้องเป็น `requests 11 / failed 0` และ `assertions 15 / failed 0` (ถ้า Codespace หลับจะได้ error เชื่อมต่อ ให้ `make run-dev` ใหม่และอัปเดต URL)

---

## แลป 3 · MVC + EJS

สไลด์ 12 · แยกโปรเจค Product API จาก `index.js` ไฟล์เดียว → configs / routes / controllers / models / views / public แล้วเพิ่มหน้าเว็บ EJS

> 💡 สไลด์ให้ดาวน์โหลด project ตั้งต้นจาก Google Drive ของอาจารย์ (มี `.env`, `docker-compose.yaml`, `index.js`) — ถ้ามีไฟล์นั้นใช้ได้เลยแต่ต้องแก้ `.env` ให้ตรงกับ docker-compose ของอาจารย์ คู่มือนี้สร้าง project ตั้งต้นให้เองใน 3.1 เพื่อให้ทำได้แม้ไม่มีไฟล์จาก Drive

### 3.1 Step 0 — Project ตั้งต้น (ทุกอย่างใน index.js)

```powershell
mkdir product-api
cd product-api
npm init -y
npm install express mysql2 dotenv
code .
```

สร้างไฟล์ฐานข้อมูล 3 ไฟล์:

📄 **ไฟล์ `docker-compose.yml`** — เปิด MySQL 8 ใน Docker

```yaml
services:
  db:
    image: mysql:8.0
    container_name: mvc-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: product_db
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppass
    ports:
      - "3306:3306"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

📄 **ไฟล์ `init.sql`** — สร้างตาราง products + ข้อมูลตัวอย่าง

```sql
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS product_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE product_db;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id           VARCHAR(36)   NOT NULL PRIMARY KEY,
  name         VARCHAR(255)  NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  discount     DECIMAL(10,2) NULL,
  review_count INT           NULL,
  image_url    VARCHAR(500)  NULL,
  is_deleted   TINYINT(1)    NOT NULL DEFAULT 0
);

INSERT INTO products (id, name, price, discount, review_count, image_url) VALUES
('1', 'เสื้อยืดคอกลมสีขาว', 299.00, 50.00, 125, 'https://picsum.photos/seed/tshirt/400'),
('2', 'USB-C Fast Charger 65W', 890.00, 100.00, 58, 'https://picsum.photos/seed/charger/400'),
('3', 'Mechanical Keyboard RGB', 2590.00, NULL, 33, 'https://picsum.photos/seed/keyboard/400');
```

📄 **ไฟล์ `.env`** — ค่าเชื่อมต่อฐานข้อมูล (ต้องตรงกับ docker-compose)

```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=appuser
DB_PASSWORD=apppass
DB_NAME=product_db
```

เปิดฐานข้อมูล (Docker Desktop ต้องเปิดอยู่):

```powershell
docker compose up -d
docker compose logs -f db
```

รอจนเห็นบรรทัด `ready for connections` ที่ลงท้ายด้วย **`port: 3306`** (ครั้งแรกประมาณ 20–40 วินาที — จะมี `ready for connections ... port: 0` ขึ้นก่อน 1 ครั้งระหว่างรัน init.sql ยังไม่ใช่) แล้วกด <kbd>Ctrl</kbd>+<kbd>C</kbd> ออกจาก log (database ยังรันอยู่เบื้องหลัง)

> ⚠️ ถ้าขึ้น `port is already allocated` แปลว่าเครื่องมี MySQL/XAMPP ใช้ 3306 อยู่ → ปิดตัวนั้น หรือแก้ใน docker-compose เป็น `"3307:3306"` แล้วแก้ `.env` เป็น `DB_PORT=3307`

> 💡 ไม่ใช้ Docker ก็ได้: เปิด XAMPP → phpMyAdmin → แท็บ SQL → วางเนื้อหา `init.sql` → Go แล้วสร้าง user ให้ตรง `.env` (หรือแก้ `.env` เป็น root ของเครื่อง)

สร้าง `index.js` แบบ "ทุกอย่างในไฟล์เดียว":

📄 **ไฟล์ `index.js`** — ก่อนแยก MVC

```js
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const app = express();
const PORT = 3000;

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

app.use(express.json());

// Root test
app.get('/', (req, res) => {
  res.send('hi');
});

// Get all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get product by ID
app.get('/products/:id', (req, res) => {
  db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
});

// Search product by keyword
app.get('/products/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  db.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [keyword], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create product
app.post('/products', (req, res) => {
  const { name, price, discount, review_count, image_url } = req.body;
  const query = 'INSERT INTO products (id, name, price, discount, review_count, image_url) VALUES (UUID(), ?, ?, ?, ?, ?)';
  db.query(query, [name, price, discount, review_count, image_url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Product created' });
  });
});

// Update product
app.put('/products/:id', (req, res) => {
  const { name, price, discount, review_count, image_url } = req.body;
  const query = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';
  db.query(query, [name, price, discount, review_count, image_url, req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product updated' });
  });
});

// Soft delete product
app.delete('/products/:id', (req, res) => {
  db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product soft-deleted' });
  });
});

// Restore product
app.put('/products/restore/:id', (req, res) => {
  db.query('UPDATE products SET is_deleted = 0 WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product restored' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
```

```powershell
node index.js
```

> ✅ **จุดเช็ค:** terminal ต้องขึ้น `🚀 Server is running at http://localhost:3000` และ `✅ Connected to MySQL`
> เปิด browser: `http://localhost:3000/` → `hi` · `http://localhost:3000/products` → JSON สินค้า 3 ชิ้น
> ถ้าเจอ `Access denied` / `ECONNREFUSED` ดูภาคผนวก — เสร็จแล้วกด Ctrl+C หยุด server

### 3.2 Step 1 — สร้างโฟลเดอร์ + แยก Config ฐานข้อมูล

```powershell
mkdir configs, controllers, models, public\css, routes, views
```

(PowerShell คั่นชื่อด้วย `,` ถ้าใช้ Command Prompt พิมพ์ `mkdir configs controllers models public\css routes views`)

ย้ายโค้ดเชื่อมต่อ MySQL ออกจาก index.js ไปไว้ไฟล์ใหม่:

📄 **ไฟล์ `configs/db.js`**

```js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

module.exports = db;
```

แก้ `index.js`: **ลบ** บรรทัด `require('mysql2')`, `require('dotenv')`, `dotenv.config()`, ก้อน `mysql.createConnection({...})` และ `db.connect(...)` ทิ้ง แล้ว **เพิ่ม** `const db = require('./configs/db');` — ได้ไฟล์แบบนี้:

📄 **ไฟล์ `index.js`** — Step 1

```js
const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./configs/db');

app.use(express.json());

// Root test
app.get('/', (req, res) => {
  res.send('hi');
});

// Get all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get product by ID
app.get('/products/:id', (req, res) => {
  db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
});

// Search product by keyword
app.get('/products/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  db.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [keyword], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create product
app.post('/products', (req, res) => {
  const { name, price, discount, review_count, image_url } = req.body;
  const query = 'INSERT INTO products (id, name, price, discount, review_count, image_url) VALUES (UUID(), ?, ?, ?, ?, ?)';
  db.query(query, [name, price, discount, review_count, image_url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Product created' });
  });
});

// Update product
app.put('/products/:id', (req, res) => {
  const { name, price, discount, review_count, image_url } = req.body;
  const query = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';
  db.query(query, [name, price, discount, review_count, image_url, req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product updated' });
  });
});

// Soft delete product
app.delete('/products/:id', (req, res) => {
  db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product soft-deleted' });
  });
});

// Restore product
app.put('/products/restore/:id', (req, res) => {
  db.query('UPDATE products SET is_deleted = 0 WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product restored' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
```

```powershell
node index.js
```

> ✅ **จุดเช็ค:** ผลเหมือน Step 0 ทุกอย่าง (`http://localhost:3000/products/search/Key` ได้ Mechanical Keyboard RGB) แล้ว Ctrl+C

### 3.3 Step 2 — สร้าง Route ของ product (app → router)

1. สร้าง `routes/productRoutes.js` บนสุดเขียน `const router = express.Router();`
2. **ย้าย route ทั้งหมด** จาก index.js (ตั้งแต่ `// Get all products` ถึงก่อน `// Start server`) มาวาง
3. **เปลี่ยน `app.` เป็น `router.` ให้หมด** (VS Code: เลือก `app.` → Ctrl+D ซ้ำ ๆ หรือ Ctrl+H แทนที่)
4. require db เป็น **`'../configs/db'`** (ขึ้นไป 1 ชั้น เพราะไฟล์อยู่ในโฟลเดอร์ routes)
5. ใส่ **`module.exports = router;`** ท้ายไฟล์

📄 **ไฟล์ `routes/productRoutes.js`** — Step 2 (ยังมี SQL อยู่)

```js
const express = require('express');
const router = express.Router();

const db = require('../configs/db');

// Get all products
router.get('/products', (req, res) => {
  db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get product by ID
router.get('/products/:id', (req, res) => {
  db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
});

// Search product by keyword
router.get('/products/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  db.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [keyword], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create product
router.post('/products', (req, res) => {
  const { name, price, discount, review_count, image_url } = req.body;
  const query = 'INSERT INTO products (id, name, price, discount, review_count, image_url) VALUES (UUID(), ?, ?, ?, ?, ?)';
  db.query(query, [name, price, discount, review_count, image_url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Product created' });
  });
});

// Update product
router.put('/products/:id', (req, res) => {
  const { name, price, discount, review_count, image_url } = req.body;
  const query = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';
  db.query(query, [name, price, discount, review_count, image_url, req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product updated' });
  });
});

// Soft delete product
router.delete('/products/:id', (req, res) => {
  db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product soft-deleted' });
  });
});

// Restore product
router.put('/products/restore/:id', (req, res) => {
  db.query('UPDATE products SET is_deleted = 0 WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product restored' });
  });
});

module.exports = router;
```

แก้ `index.js` เหลือแค่นี้:

📄 **ไฟล์ `index.js`** — Step 2

```js
const express = require('express');
const app = express();
const PORT = 3000;

const productRoutes = require('./routes/productRoutes');

app.use(express.json());
app.use('/api', productRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
```



```powershell
node index.js
```

> ✅ **จุดเช็ค:** `http://localhost:3000/api/products` → JSON ✔
> `http://localhost:3000/products` (ไม่มี /api) → **`Cannot GET /products`** = ถูกต้อง เพราะย้ายไปอยู่ใต้ /api แล้ว

> ⚠️ สไลด์บางหน้าเขียน require เป็น `'./configs/db'` หรือ `'../config/db'` (ไม่มี s) — ต้องตรงกับชื่อโฟลเดอร์จริง ไม่งั้นได้ `Error: Cannot find module` และสไลด์สะกดชื่อไฟล์ `productRountes.js` ผิด ให้ใช้ `productRoutes.js`

### 3.4 Step 3 — สร้าง Controller (ย้ายส่วนที่ไม่ใช่เส้นทาง)

ย้ายฟังก์ชัน `(req, res) => {...}` ของแต่ละ route ไปไว้ใน controller แล้วแก้ route ให้เรียกเมธอด:

📄 **ไฟล์ `controllers/productController.js`** — Step 3 (Controller ยังคุย DB เอง)

```js
const db = require('../configs/db');

const productController = {
  // Get all products
  getAllProducts: (req, res) => {
    db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  getProductById: (req, res) => {
    db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0] || {});
    });
  },

  searchProducts: (req, res) => {
    const keyword = `%${req.params.keyword}%`;
    db.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [keyword], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  createProduct: (req, res) => {
    const { name, price, discount, review_count, image_url } = req.body;
    const query = 'INSERT INTO products (id, name, price, discount, review_count, image_url) VALUES (UUID(), ?, ?, ?, ?, ?)';
    db.query(query, [name, price, discount, review_count, image_url], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Product created' });
    });
  },

  updateProduct: (req, res) => {
    const { name, price, discount, review_count, image_url } = req.body;
    const query = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';
    db.query(query, [name, price, discount, review_count, image_url, req.params.id], err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product updated' });
    });
  },

  softDeleteProduct: (req, res) => {
    db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product soft-deleted' });
    });
  },

  restoreProduct: (req, res) => {
    db.query('UPDATE products SET is_deleted = 0 WHERE id = ?', [req.params.id], err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product restored' });
    });
  }
};

module.exports = productController;
```

📄 **ไฟล์ `routes/productRoutes.js`** — เหลือแค่การจับคู่ URL

```js
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);

router.get('/products/:id', productController.getProductById);

router.get('/products/search/:keyword', productController.searchProducts);

router.post('/products', productController.createProduct);

router.put('/products/:id', productController.updateProduct);

router.delete('/products/:id', productController.softDeleteProduct);

router.put('/products/restore/:id', productController.restoreProduct);

module.exports = router;
```

- สไลด์มี `router.get('/products/:id', ...)` ซ้ำ 2 บรรทัด — ตัดเหลือบรรทัดเดียว

```powershell
node index.js
```

> ✅ **จุดเช็ค:** `http://localhost:3000/api/products` ยังได้ JSON เหมือนเดิม — โครงสร้างเปลี่ยนแต่ผลลัพธ์ต้องไม่เปลี่ยน

### 3.5 Step 4 — แยก Model (SQL ทั้งหมด) + uuid

```powershell
npm install uuid
```

สร้าง Model:

📄 **ไฟล์ `models/productModel.js`** — Step 4

```js
const db = require('../configs/db');
const { v4: uuidv4 } = require('uuid'); // เพิ่ม UUID สำหรับสร้าง ID สินค้าใหม่

const Product = {
  // ดึงข้อมูลสินค้าทั้งหมด
  getAll: (callback) => {
    const query = 'SELECT * FROM products WHERE is_deleted = 0';
    db.query(query, callback);
  },

  // ดึงข้อมูลสินค้าตาม ID
  getById: (id, callback) => {
    const query = 'SELECT * FROM products WHERE id = ? AND is_deleted = 0';
    db.query(query, [id], callback);
  },

  // ค้นหาสินค้าตาม Keyword
  searchByKeyword: (keyword, callback) => {
    const searchTerm = `%${keyword}%`;
    const query = 'SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0';
    db.query(query, [searchTerm], callback);
  },

  // สร้างสินค้าใหม่
  create: (productData, callback) => {
    const { name, price, discount, review_count, image_url } = productData;
    const id = uuidv4(); // สร้าง ID สินค้าใหม่
    const query = 'INSERT INTO products (id, name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [id, name, price, discount, review_count, image_url], callback);
  },

  // อัปเดตสินค้า
  update: (id, productData, callback) => {
    const { name, price, discount, review_count, image_url } = productData;
    const query = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';
    db.query(query, [name, price, discount, review_count, image_url, id], callback);
  },

  // Soft Delete สินค้า
  softDelete: (id, callback) => {
    const query = 'UPDATE products SET is_deleted = 1 WHERE id = ?';
    db.query(query, [id], callback);
  },

  // Restore สินค้า
  restore: (id, callback) => {
    const query = 'UPDATE products SET is_deleted = 0 WHERE id = ?';
    db.query(query, [id], callback);
  },

};

module.exports = Product;
```

แก้ Controller ให้เรียก Model:

📄 **ไฟล์ `controllers/productController.js`** — Step 4

```js
const Product = require('../models/productModel');

const productController = {
  // Get all products
  getAllProducts: (req, res) => {
    Product.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Get product by ID
  getProductById: (req, res) => {
    Product.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0] || {});
    });
  },

  // Search product by keyword
  searchProducts: (req, res) => {
    const { keyword } = req.params;
    Product.searchByKeyword(keyword, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Create product
  createProduct: (req, res) => {
    const { name, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ error: 'name and price are required' });
    }

    Product.create(req.body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: 'Product created',
      });
    });
  },

  // Update product
  updateProduct: (req, res) => {
    const { id } = req.params;
    Product.update(id, req.body, err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product updated' });
    });
  },

  // Soft delete product
  softDeleteProduct: (req, res) => {
    const { id } = req.params;
    Product.softDelete(id, err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product soft-deleted' });
    });
  },

  // Restore product
  restoreProduct: (req, res) => {
    const { id } = req.params;
    Product.restore(id, err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product restored' });
    });
  },

};

module.exports = productController;
```

> ⚠️ uuid เวอร์ชัน 12 ขึ้นไปเป็น ESM — Node 22.12+ ใช้ `require('uuid')` ได้ ถ้า Node เก่ากว่าแล้วเจอ `ERR_REQUIRE_ESM` ให้ `npm install uuid@9`

สร้างไฟล์ `request.rest` สำหรับทดสอบด้วย REST Client (กด **Send Request** เหนือแต่ละ request):

📄 **ไฟล์ `request.rest`**

```http
### Get all products
GET http://localhost:3000/api/products

### Get product by id
GET http://localhost:3000/api/products/1

### Search
GET http://localhost:3000/api/products/search/Key

### Create
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "iPhone 17",
  "price": 37900,
  "image_url": "https://picsum.photos/seed/iphone/400"
}

### Create (missing price -> 400)
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "x"
}

### Update
PUT http://localhost:3000/api/products/2
Content-Type: application/json

{
  "name": "Charger 100W",
  "price": 990,
  "discount": 0,
  "review_count": 60,
  "image_url": "https://picsum.photos/seed/charger/400"
}

### Soft delete
DELETE http://localhost:3000/api/products/3

### Restore
PUT http://localhost:3000/api/products/restore/3
```

```powershell
node index.js
```

> ✅ **จุดเช็ค:** ไล่กด Send ทีละ request:
> - GET all → 200 รายการสินค้า · GET by id → สินค้าชิ้นที่ 1 · Search → Mechanical Keyboard RGB
> - Create → **201** `{"message":"Product created"}` · Create (missing price) → **400** `{"error":"name and price are required"}`
> - Update → `Product updated` · Soft delete → `Product soft-deleted` (GET /api/products/3 จะได้ `{}`) · Restore → `Product restored`

### 3.6 Step 5 — เพิ่ม View ด้วย EJS

```powershell
npm install ejs
```

1) เพิ่มเมธอดใน **Model** (วางต่อจาก `restore` ก่อน `};` บรรทัดสุดท้าย):

```js
  // ดึงข้อมูลสินค้าทั้งหมดสำหรับการแสดงผลใน view
  getProductsView: (callback) => {
    const query = 'SELECT * FROM products WHERE is_deleted = 0';
    db.query(query, callback);
  },
```

2) เพิ่มเมธอดใน **Controller** (ต่อจาก `restoreProduct` ก่อน `};`):

```js
  // Add views for products
  getProductsView: (req, res) => {
    Product.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.render('products', { products: results }); // ส่งผลลัพธ์ไปยัง view
    });
  },
```

3) สร้าง route ของหน้าเว็บ:

📄 **ไฟล์ `routes/webRoutes.js`**

```js
// routes/webRoutes.js
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/', productController.getProductsView);

module.exports = router;
```

4) สร้าง view (สไลด์เขียน CSS ไว้ใน `<style>` ก่อน):

📄 **ไฟล์ `views/products.ejs`** — Step 5 (CSS อยู่ในไฟล์)

```html
<!-- views/products.ejs -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Product List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 2rem;
            background-color: #f8f9fa;
        }

        h1 {
            text-align: center;
        }

        .grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-top: 2rem;
        }

        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 240px;
            padding: 1rem;
            text-align: center;
        }

        .card img {
            width: 100%;
            height: 180px;
            object-fit: cover;
            border-radius: 6px;
        }

        .card h3 {
            font-size: 1rem;
            margin: 0.5rem 0;
        }

        .card p {
            color: #28a745;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <h1>🛍️ Product List</h1>

    <div class="grid">
        <% products.forEach(product => { %>
            <div class="card">
                <img src="<%= product.image_url %>" alt="<%= product.name %>" />
                <h3>
                    <%= product.name %>
                </h3>
                <p>
                    <%= product.price.toLocaleString() %> บาท
                </p>
            </div>
        <% }) %>
    </div>
</body>

</html>
```

5) แก้ `index.js` ตั้ง view engine และผูก webRoutes:

📄 **ไฟล์ `index.js`** — Step 5

```js
const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

const productRoutes = require('./routes/productRoutes');
const webRoutes = require('./routes/webRoutes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use('/api', productRoutes);
app.use('/', webRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
```

```powershell
node index.js
```

> ✅ **จุดเช็ค:** เปิด `http://localhost:3000/` เห็นหัวข้อ **🛍️ Product List** และการ์ดสินค้าพร้อมรูปและราคา (ราคาแสดง `299.00 บาท` เพราะ MySQL ส่ง DECIMAL มาเป็น string)

### 3.7 Step 6 — แยก CSS ไป `public/` + `express.static`

1. สร้าง `public/css/products.css` แล้ว **ย้ายทุกบรรทัดใน `<style>...</style>`** มาไว้ (ไม่ต้องมีแท็ก style)

📄 **ไฟล์ `public/css/products.css`**

```css
body {
    font-family: Arial, sans-serif;
    margin: 2rem;
    background-color: #f8f9fa;
}

h1 {
    text-align: center;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 2rem;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 240px;
    padding: 1rem;
    text-align: center;
}

.card img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 6px;
}

.card h3 {
    font-size: 1rem;
    margin: 0.5rem 0;
}

.card p {
    color: #28a745;
    font-weight: bold;
}
```

2. ใน `products.ejs` ลบก้อน `<style>...</style>` ทั้งหมด แทนด้วยบรรทัดเดียว:

📄 **ไฟล์ `views/products.ejs`** — ฉบับสมบูรณ์

```html
<!-- views/products.ejs -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Product List</title>
    <link rel="stylesheet" href="/css/products.css">
</head>

<body>
    <h1>🛍️ Product List</h1>

    <div class="grid">
        <% products.forEach(product => { %>
            <div class="card">
                <img src="<%= product.image_url %>" alt="<%= product.name %>" />
                <h3>
                    <%= product.name %>
                </h3>
                <p>
                    <%= product.price.toLocaleString() %> บาท
                </p>
            </div>
        <% }) %>
    </div>
</body>

</html>
```

3. ใน `index.js` เพิ่ม `app.use(express.static('public'));` (สไลด์พิมพ์ผิดเป็น 'pubilc'):

📄 **ไฟล์ `index.js`** — ฉบับสมบูรณ์

```js
const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

const productRoutes = require('./routes/productRoutes');
const webRoutes = require('./routes/webRoutes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'));
app.use('/api', productRoutes);
app.use('/', webRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
```

```powershell
node index.js
```

> ✅ **จุดเช็ค:** `http://localhost:3000/` หน้าตาเหมือน Step 5 ทุกอย่าง และ `http://localhost:3000/css/products.css` เปิดเห็นโค้ด CSS — ตอนนี้โปรเจคเป็น MVC สมบูรณ์แล้ว (เทียบกับโฟลเดอร์ `mvc-lab` ใน zip)

**โครงสร้างสุดท้าย:**

```
product-api/
├── configs/db.js
├── controllers/productController.js
├── models/productModel.js
├── public/css/products.css
├── routes/productRoutes.js
├── routes/webRoutes.js
├── views/products.ejs
├── .env  ·  docker-compose.yml  ·  init.sql  ·  request.rest
├── index.js
└── package.json
```

### 3.8 โจทย์ประยุกต์ (เล่มสรุป) + เฉลย

**โจทย์ 1:** `GET /api/products/:id` ถ้าไม่พบให้ตอบ **404** `{ "error": "Product not found" }` (ตอนนี้ตอบ `{}` สถานะ 200)

แก้เมธอด `getProductById` ใน `controllers/productController.js`:

```js
  getProductById: (req, res) => {
    Product.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(results[0]);
    });
  },
```

**โจทย์ 2:** เพิ่ม `GET /api/products/deleted` แสดงสินค้าที่ถูก soft delete

Model — เพิ่มเมธอด:

```js
  // [แบบฝึก] ดึงสินค้าที่ถูก soft delete
  getDeleted: (callback) => {
    const query = 'SELECT * FROM products WHERE is_deleted = 1';
    db.query(query, callback);
  },
```

Controller — เพิ่มเมธอด:

```js
  // [แบบฝึก] Get soft-deleted products (ถังขยะ)
  getDeletedProducts: (req, res) => {
    Product.getDeleted((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },
```

Route — **ต้องวางก่อน** `/products/:id`:

📄 **ไฟล์ `routes/productRoutes.js`** — เฉลยโจทย์ 2

```js
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);

// ต้องอยู่ "ก่อน" /products/:id ไม่งั้น "deleted" จะถูกจับเป็น :id
router.get('/products/deleted', productController.getDeletedProducts);

router.get('/products/:id', productController.getProductById);

router.get('/products/search/:keyword', productController.searchProducts);

router.post('/products', productController.createProduct);

router.put('/products/:id', productController.updateProduct);

router.delete('/products/:id', productController.softDeleteProduct);

router.put('/products/restore/:id', productController.restoreProduct);

module.exports = router;
```

> ⚠️ ถ้าวาง `/products/deleted` **หลัง** `/products/:id` Express จะจับคำว่า `deleted` เป็น `:id` แล้วตอบ 404 `Product not found` (ทดสอบแล้ว) — route ที่เป็นคำตายตัวต้องมาก่อน route ที่มี parameter เสมอ

**โจทย์ 3:** หน้าเว็บรายละเอียดสินค้า `GET /products/:id` + ทำลิงก์จากหน้ารวม

Controller — เพิ่มเมธอด:

```js
  // [แบบฝึก] หน้ารายละเอียดสินค้า
  getProductDetailView: (req, res) => {
    Product.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).send(err.message);
      if (results.length === 0) return res.status(404).send('Product not found');
      res.render('product-detail', { product: results[0] });
    });
  },
```

📄 **ไฟล์ `routes/webRoutes.js`** — เฉลยโจทย์ 3

```js
// routes/webRoutes.js
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/', productController.getProductsView);
router.get('/products/:id', productController.getProductDetailView);

module.exports = router;
```

📄 **ไฟล์ `views/product-detail.ejs`** — เฉลยโจทย์ 3

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title><%= product.name %></title>
    <link rel="stylesheet" href="/css/products.css">
</head>

<body>
    <a href="/">← กลับหน้ารวม</a>
    <div class="card">
        <img src="<%= product.image_url %>" alt="<%= product.name %>" />
        <h3><%= product.name %></h3>
        <p><%= Number(product.price).toLocaleString() %> บาท</p>
        <% if (product.discount) { %>
            <p>ส่วนลด <%= product.discount %> บาท</p>
        <% } else { %>
            <p>ไม่มีส่วนลด</p>
        <% } %>
        <p>รีวิว <%= product.review_count || 0 %> รายการ</p>
    </div>
</body>

</html>
```

และใน `views/products.ejs` เปลี่ยนชื่อสินค้าใน `<h3>` เป็นลิงก์:

```html
<h3>
    <a href="/products/<%= product.id %>"><%= product.name %></a>
</h3>
```

> ✅ **จุดเช็ค:** - `GET /api/products/999` → **404** `{"error":"Product not found"}`
> - ลบสินค้า 3 แล้ว `GET /api/products/deleted` → เห็น Mechanical Keyboard RGB
> - `http://localhost:3000/products/1` → หน้ารายละเอียด (299 บาท / ส่วนลด 50.00 บาท / รีวิว 125 รายการ) และชื่อสินค้าในหน้ารวมกดได้
> - ไฟล์เฉลยครบชุดอยู่ในโฟลเดอร์ `exercises/mvc` ของ zip

เลิกใช้ฐานข้อมูล: `docker compose down` (ข้อมูลยังอยู่) · รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้น: `docker compose down -v` แล้ว `docker compose up -d`

---

## แลป 4 · Cookies (Project I + Project II)

สไลด์ 13

### 4.1 แลปทดลอง: ขโมย Session ที่ the-internet.herokuapp.com

1. เปิด https://the-internet.herokuapp.com/login → Username `tomsmith` Password `SuperSecretPassword!` → Login → เข้าหน้า **Secure Area**
2. กด <kbd>F12</kbd> → แท็บ **Application** → Storage → **Cookies** → `https://the-internet.herokuapp.com` → เห็น cookie ชื่อ **`rack.session`**
3. คลิกขวา `rack.session` → **Delete** → กด <kbd>F5</kbd> → ถูกเด้งไปหน้า Login ("You must login to view the secure area!") = สถานะ login อยู่ใน cookie นี้
4. Login ใหม่ → ดับเบิลคลิกช่อง Value ของ rack.session → **copy ค่า**
5. เปิด **New Incognito Window** (Ctrl+Shift+N) → เข้า https://the-internet.herokuapp.com/secure → ถูกเด้งไป login
6. ใน Incognito เปิด DevTools → Application → Cookies → แก้/เพิ่ม `rack.session` ให้ Value = ค่าที่ copy มา → F5 → **เข้า Secure Area ได้โดยไม่ต้องใส่รหัส** = Session Hijacking
7. แท็บ **Network** → คลิก request `secure` → Request Headers มี `Cookie: rack.session=...`

### 4.2 Project I — Session Cookie + Role (Admin / Lecturer / Student)

```powershell
mkdir cookies-project1
cd cookies-project1
npm init -y
npm install express cors cookie-parser
code .
```

**Frontend:**

📄 **ไฟล์ `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Authentication & Authorization Demo</title>
    <script src="client.js" defer></script>
  </head>
  <body>
    <button id="login-student">Login as Student</button>
    <button id="login-lecturer">Login as Lecturer</button>
    <button id="login-admin">Login as Admin</button>
    <br />
    <br />
    <button id="admin">Access Admin-Only Data</button>
    <br />
    <br />
    <div id="responses"></div>
  </body>
</html>
```

📄 **ไฟล์ `client.js`**

```js
const loginAsStudentBtn = document.getElementById("login-student");
const loginAsLecturerBtn = document.getElementById("login-lecturer");
const loginAsAdminBtn = document.getElementById("login-admin");
const adminBtn = document.getElementById("admin");
const responsesDiv = document.getElementById("responses");

loginAsStudentBtn.addEventListener("click", () => {
  login("Student");
});

loginAsLecturerBtn.addEventListener("click", () => {
  login("Lecturer");
});

loginAsAdminBtn.addEventListener("click", () => {
  login("Admin");
});

function login(username) {
  fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })
    .then((res) => res.text())
    .then((data) => (responsesDiv.textContent = data));
}

adminBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/adminData", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.text())
    .then((data) => (responsesDiv.textContent = data));
});
```

**Backend:**

📄 **ไฟล์ `server.js`** — ตามสไลด์ (ยังมีปัญหา — แก้ใน 4.3)

```js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(cookieParser());

const USERS = new Map();
USERS.set("Admin", { id: 1, username: "Admin", role: "Admin" });
USERS.set("Lecturer", { id: 2, username: "Lecturer", role: "Lecturer" });

const SESSIONS = new Map();

app.post("/login", (req, res) => {
  const user = USERS.get(req.body.username);
  if (user == null) {
    res.sendStatus(401);
    return;
  }

  const sessionId = crypto.randomUUID();

  SESSIONS.set(sessionId, user);

  res
    .cookie("sessionId", sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    })
    .send(`Authed as ${req.body.username}`);
});

app.get("/adminData", (req, res) => {
  const user = SESSIONS.get(req.cookies.sessionId);
  if (user == null) {
    res.sendStatus(401);
    return;
  }

  if (user.role !== "Admin") {
    res.sendStatus(403);
    return;
  }

  res.send("Authorized: You are viewing restricted administrator controls.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**รัน:**

```powershell
node server.js
```

แล้วใน VS Code **คลิกขวา `index.html` → Open with Live Server** → browser เปิด `http://127.0.0.1:5500/index.html`

> ⚠️ URL ต้องเป็น `127.0.0.1:5500` ถ้า Live Server เปิดเป็น port อื่น (เช่น 5501 เพราะ 5500 ไม่ว่าง) จะเจอ CORS error ใน Console → ปิดหน้า Live Server อื่น หรือแก้ origin ใน server.js

> ✅ **จุดเช็ค:** กดปุ่มตามลำดับแล้วดูข้อความใต้ปุ่ม:
> 
> | กด | ผล |
> |---|---|
> | Access Admin-Only Data (ยังไม่ login) | `Unauthorized` |
> | Login as Admin → Access Admin-Only Data | `Authed as Admin` → `Authorized: You are viewing restricted administrator controls.` |
> | Login as Lecturer → Access Admin-Only Data | `Authed as Lecturer` → `Forbidden` |
> 
> ตรวจ cookie: F12 → Application → Cookies → **`http://localhost:3000`** → `sessionId` ติ๊ก HttpOnly ✓ Secure ✓ SameSite None · แท็บ Network → คลิก `adminData` → Request Headers มี `Cookie: sessionId=...`

### 4.3 แก้ปัญหา "Login เป็น Student แต่ยังเข้าถึงข้อมูล Admin ได้"

**ลองทำให้เห็นปัญหาก่อน:** Login as Admin → Login as Student (ได้ `Unauthorized`) → กด Access Admin-Only Data → **ได้ `Authorized`!** เพราะ login Student ไม่สำเร็จแต่ cookie/session ของ Admin เดิมยังอยู่

**วิธีแก้ (สไลด์):** เมื่อ login ไม่สำเร็จให้ **ลบ session เดิมบน server** และ **ลบ cookie ใน browser** — แก้ก้อน `if (user == null)` ใน `/login` เป็น:

```js
  if (user == null) {
    SESSIONS.delete(req.cookies.sessionId);   // ลบ Session เดิมบน Server
    res.clearCookie("sessionId", {            // ลบ Session Cookie ใน Browser
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    return res.sendStatus(401);               // Login ไม่สำเร็จ
  }
```

### 4.4 เพิ่มปุ่ม Logout (ต่อยอดจากเล่มสรุป)

`index.html` — เพิ่มปุ่มต่อจากปุ่ม admin:

```html
    <button id="logout">Logout</button>
```

`client.js` — เพิ่มบรรทัดอ้างอิงปุ่ม (ไว้กับตัวแปรอื่นด้านบน) และ event ท้ายไฟล์:

```js
const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.text())
    .then((data) => (responsesDiv.textContent = data));
});
```

`server.js` — เพิ่ม route ก่อน `app.listen`:

```js
app.post("/logout", (req, res) => {
  SESSIONS.delete(req.cookies.sessionId);
  res.clearCookie("sessionId", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.send("Logged out");
});
```

ไฟล์ `server.js` ที่ได้หลังทำ 4.3 + 4.4:

📄 **ไฟล์ `server.js`** — ฉบับสมบูรณ์

```js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(cookieParser());

const USERS = new Map();
USERS.set("Admin", { id: 1, username: "Admin", role: "Admin" });
USERS.set("Lecturer", { id: 2, username: "Lecturer", role: "Lecturer" });

const SESSIONS = new Map();

app.post("/login", (req, res) => {
  const user = USERS.get(req.body.username);
  if (user == null) {
    SESSIONS.delete(req.cookies.sessionId);
    res.clearCookie("sessionId", {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    return res.sendStatus(401);
  }

  const sessionId = crypto.randomUUID();

  SESSIONS.set(sessionId, user);

  res
    .cookie("sessionId", sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    })
    .send(`Authed as ${req.body.username}`);
});

app.get("/adminData", (req, res) => {
  const user = SESSIONS.get(req.cookies.sessionId);
  if (user == null) {
    res.sendStatus(401);
    return;
  }

  if (user.role !== "Admin") {
    res.sendStatus(403);
    return;
  }

  res.send("Authorized: You are viewing restricted administrator controls.");
});

app.post("/logout", (req, res) => {
  SESSIONS.delete(req.cookies.sessionId);
  res.clearCookie("sessionId", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.send("Logged out");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

```powershell
node server.js
```

(หยุด server เก่าด้วย Ctrl+C แล้วรันใหม่ทุกครั้งที่แก้ server.js — หน้าเว็บ Live Server รีโหลดเองเมื่อแก้ html/js)

> ✅ **จุดเช็ค:** - Login as Admin → Login as Student → Access Admin-Only Data → **`Unauthorized`** (แก้แล้ว)
> - Login as Admin → Logout → `Logged out` → Access Admin-Only Data → `Unauthorized`
> - พิมพ์ `document.cookie` ใน Console → ได้ `''` (ว่าง) เพราะ httpOnly

**ทดลองเพิ่ม (เข้าใจ CORS / credentials):**
- ลบ `credentials: "include"` ใน fetch ของ adminData → login Admin แล้วกด Access → `Unauthorized` เพราะ browser ไม่แนบ cookie (ทดสอบแล้ว) — แก้กลับ
- เปิดหน้าเว็บด้วย `http://localhost:5500/index.html` (แทน 127.0.0.1) → Console ขึ้น `blocked by CORS policy ... 'Access-Control-Allow-Origin' header has a value 'http://127.0.0.1:5500' that is not equal to the supplied origin`

### 4.5 Project II — เก็บรหัสผ่านด้วย bcrypt + REST Client

ทำในโฟลเดอร์ใหม่ (หยุด server ของ Project I ก่อน)

```powershell
mkdir password-login
cd password-login
npm init -y
npm i express bcrypt
npm i --save-dev nodemon
code .
```

> ⚠️ สไลด์พิมพ์ `–save-dev` ด้วยขีดยาว ต้องพิมพ์ `--save-dev` (ขีดสั้น 2 ตัว)

เปลี่ยน `"scripts"` ใน `package.json` จาก `"test": "echo \"Error: no test specified\" && exit 1"` เป็น:

```json
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
```

**ขั้นที่ 1 — GET /users**

📄 **ไฟล์ `server.js`** — v1

```js
const express = require("express");
const app = express();

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(3000);
```

📄 **ไฟล์ `request.rest`**

```http
### Get all users
GET http://localhost:3000/users

### Create a new user
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "Elon Musk",
  "password": "syntaxerror"
}

### Login user
POST http://localhost:3000/users/login
Content-Type: application/json

{
  "name": "Elon Musk",
  "password": "syntaxerror"
}
```

สร้าง `request.rest` (เริ่มจาก request แรกก่อนก็ได้) — ระหว่าง header กับ body **ต้องเว้น 1 บรรทัด**

```powershell
npm run dev
```

> ✅ **จุดเช็ค:** terminal ขึ้น `> node --watch server.js` · ใน request.rest กด **Send Request** เหนือ `GET http://localhost:3000/users` → แผงขวาได้ `HTTP/1.1 200 OK` และ body `[]`

**ขั้นที่ 2 — POST /users (เก็บรหัสแบบ plaintext — ยังไม่ปลอดภัย)**

📄 **ไฟล์ `server.js`** — v2

```js
const express = require("express");
const app = express();

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const user = {
    name: req.body.name,
    password: req.body.password,
  };
  users.push(user);
  res.status(201).send();
});

app.listen(3000);
```

> ✅ **จุดเช็ค:** (`npm run dev` รีสตาร์ทให้เองเมื่อกด Save) Send **Create a new user** → `HTTP/1.1 201 Created` → Send **Get all users** → `[{"name":"Elon Musk","password":"syntaxerror"}]` — เห็นรหัสจริง = ถ้าฐานข้อมูลหลุด รหัสหลุดทันที

**ขั้นที่ 3 — ทดลอง bcrypt (`learn.js`)**

📄 **ไฟล์ `learn.js`**

```js
const bcrypt = require("bcrypt");

const password = "MyPassword123";

async function main() {
  // Hash สองครั้ง โดยใช้ Cost = 10 เหมือนกัน
  // แต่ค่า salt ไม่เหมือนกัน เพราะจะถูกสุ่มค่าใหม่เสมอ
  const hash1 = await bcrypt.hash(password, 10);
  const hash2 = await bcrypt.hash(password, 10);

  console.log(hash1);
  console.log(hash2);

  console.log(hash1 === hash2); // false
  console.log(await bcrypt.compare(password, hash1)); // true
  console.log(await bcrypt.compare(password, hash2)); // true
  console.log(await bcrypt.compare("wrongPassword", hash1)); // false
}

main();
```

> ⚠️ learn.js ในสไลด์ไม่มี `await` → พิมพ์ได้ `Promise { <pending> }` และพังด้วย `Error: data and hash must be strings` (ทดสอบแล้ว) ไฟล์ข้างบนแก้แล้ว

```powershell
node learn.js
```

> ✅ **จุดเช็ค:** ได้ 6 บรรทัด: hash 2 ค่าขึ้นต้น `$2b$10$` แต่ **ไม่เหมือนกัน** (salt สุ่มใหม่) → `false` (hash1 === hash2) → `true` → `true` (compare อ่าน salt/cost จาก hash เอง) → `false` (รหัสผิด) — รันซ้ำ hash จะเปลี่ยนทุกครั้ง

**ขั้นที่ 4 — server เก็บ hash + Login**

📄 **ไฟล์ `server.js`** — ฉบับสมบูรณ์

```js
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
```

> ⚠️ สไลด์หน้า 50 เขียน `users.find(user => user.name = req.body.name)` (ใช้ `=` กำหนดค่า) → find คืน user คนแรกเสมอ และ **เปลี่ยนชื่อเขา** — ทดสอบแล้ว: login ชื่อ "Nobody" ด้วยรหัสของ Elon ได้ `Success`! ไฟล์ข้างบนแก้เป็น `===` แล้ว

> ✅ **จุดเช็ค:** Send ตามลำดับใน request.rest:
> 1. Get all users → `[]`
> 2. Create a new user → `201 Created` · terminal พิมพ์ salt และ hash (hash ขึ้นต้นด้วย salt เดียวกัน)
> 3. Get all users → `"password": "$2b$10$...."` (ไม่เห็นรหัสจริงแล้ว)
> 4. Login user → `Success` · แก้ password ใน body เป็น `"error"` → `Not Allowed` · แก้ name เป็นชื่ออื่น → `400 Cannot find user`

### 4.6 โจทย์ประยุกต์ (เล่มสรุป) + เฉลย

**โจทย์ 1–3 (ต่อยอด Project I):**
1. เพิ่ม user **Student** และ route `/lecturerData` ที่ Lecturer และ Admin เข้าได้ แต่ Student ได้ 403
2. เพิ่ม `GET /me` ตอบข้อมูล user ปัจจุบันจาก session (ไม่มี session → 401)
3. ให้ cookie หมดอายุใน 1 นาที

**เฉลย** — `server.js` ของ Project I (ทำในโฟลเดอร์ `cookies-project1`):

📄 **ไฟล์ `server.js`** — เฉลยโจทย์ 1–3

```js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(cookieParser());

const USERS = new Map();
USERS.set("Admin", { id: 1, username: "Admin", role: "Admin" });
USERS.set("Lecturer", { id: 2, username: "Lecturer", role: "Lecturer" });
USERS.set("Student", { id: 3, username: "Student", role: "Student" }); // [แบบฝึก 1] เพิ่ม Student

const SESSIONS = new Map();

app.post("/login", (req, res) => {
  const user = USERS.get(req.body.username);
  if (user == null) {
    SESSIONS.delete(req.cookies.sessionId);
    res.clearCookie("sessionId", { secure: true, httpOnly: true, sameSite: "none" });
    return res.sendStatus(401);
  }

  const sessionId = crypto.randomUUID();
  SESSIONS.set(sessionId, user);

  res
    .cookie("sessionId", sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 60 * 1000, // [แบบฝึก 3] Cookie หมดอายุใน 1 นาที (หน่วย ms)
    })
    .send(`Authed as ${req.body.username}`);
});

// [แบบฝึก 2] ดูว่าตอนนี้ login เป็นใคร
app.get("/me", (req, res) => {
  const user = SESSIONS.get(req.cookies.sessionId);
  if (user == null) {
    return res.sendStatus(401);
  }
  res.json(user);
});

app.get("/adminData", (req, res) => {
  const user = SESSIONS.get(req.cookies.sessionId);
  if (user == null) {
    return res.sendStatus(401);
  }
  if (user.role !== "Admin") {
    return res.sendStatus(403);
  }
  res.send("Authorized: You are viewing restricted administrator controls.");
});

// [แบบฝึก 1] Lecturer และ Admin เข้าได้, Student ไม่ได้
app.get("/lecturerData", (req, res) => {
  const user = SESSIONS.get(req.cookies.sessionId);
  if (user == null) {
    return res.sendStatus(401);
  }
  if (!["Lecturer", "Admin"].includes(user.role)) {
    return res.sendStatus(403);
  }
  res.send("Lecturer area: grade book");
});

app.post("/logout", (req, res) => {
  SESSIONS.delete(req.cookies.sessionId);
  res.clearCookie("sessionId", { secure: true, httpOnly: true, sameSite: "none" });
  res.send("Logged out");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**ทดสอบ:** รัน `node server.js` + เปิด index.html ด้วย Live Server → Login as Student → เปิดแท็บใหม่ไปที่ `http://localhost:3000/me` และ `http://localhost:3000/lecturerData` (หรือทดสอบด้วย curl ใน **Git Bash** ตามด้านล่าง — `-c`/`-b jar.txt` = เก็บ/ส่ง cookie แบบที่ browser ทำ)

```bash
curl -c jar.txt -b jar.txt -X POST localhost:3000/login -H "Content-Type: application/json" -d '{"username":"Student"}' -i
curl -b jar.txt localhost:3000/me
curl -b jar.txt localhost:3000/lecturerData
curl -c jar.txt -b jar.txt -X POST localhost:3000/login -H "Content-Type: application/json" -d '{"username":"Lecturer"}'
curl -b jar.txt localhost:3000/lecturerData
curl -b jar.txt localhost:3000/adminData
```

> ✅ **จุดเช็ค:** - login Student มี header `Set-Cookie: sessionId=...; Max-Age=60; ...; HttpOnly; Secure; SameSite=None`
> - `/me` → `{"id":3,"username":"Student","role":"Student"}` · `/lecturerData` → `Forbidden`
> - Lecturer: `/lecturerData` → `Lecturer area: grade book` · `/adminData` → `Forbidden`
> - รอเกิน 1 นาทีแล้วเรียก `/me` ใน browser → `Unauthorized` (cookie หมดอายุ)

**โจทย์ 4 (มัดรวม Project I + II):** สมัครด้วย bcrypt, login แล้วได้ session cookie, `/profile` ต้อง login, `/admin` ต้องเป็น Admin, มี logout — ทำในโฟลเดอร์ `password-login`:

```powershell
npm i cookie-parser
```

📄 **ไฟล์ `server.js`** — เฉลยโจทย์ 4

```js
const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cookieParser());

const users = []; // { name, password(hash), role }
const SESSIONS = new Map(); // sessionId -> { name, role }

// สมัครสมาชิก: เก็บเฉพาะ hash ไม่เก็บรหัสผ่านจริง
app.post("/users", async (req, res) => {
  const { name, password, role } = req.body;
  if (!name || !password) {
    return res.status(400).send("name and password are required");
  }
  if (users.find((u) => u.name === name)) {
    return res.status(409).send("User already exists");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ name, password: hashedPassword, role: role || "Student" });
    res.status(201).send("Created");
  } catch {
    res.status(500).send();
  }
});

// Login: ตรวจรหัสด้วย bcrypt.compare แล้วสร้าง Session + ส่ง Cookie
app.post("/users/login", async (req, res) => {
  const user = users.find((u) => u.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) {
      return res.status(401).send("Not Allowed");
    }
    const sessionId = crypto.randomUUID();
    SESSIONS.set(sessionId, { name: user.name, role: user.role });
    res
      .cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 60 * 1000, // 30 นาที
      })
      .send("Success");
  } catch {
    res.status(500).send();
  }
});

// Middleware ตรวจ Session (ใช้ซ้ำได้หลาย route)
function requireLogin(req, res, next) {
  const session = SESSIONS.get(req.cookies.sessionId);
  if (session == null) {
    return res.sendStatus(401);
  }
  req.user = session;
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.sendStatus(403);
    }
    next();
  };
}

app.get("/profile", requireLogin, (req, res) => {
  res.json(req.user);
});

app.get("/admin", requireLogin, requireRole("Admin"), (req, res) => {
  res.send("Welcome Admin");
});

app.post("/logout", (req, res) => {
  SESSIONS.delete(req.cookies.sessionId);
  res.clearCookie("sessionId", { httpOnly: true, secure: true, sameSite: "strict" });
  res.send("Logged out");
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

```bash
curl -c jar.txt -b jar.txt -X POST localhost:3000/users -H "Content-Type: application/json" -d '{"name":"somchai","password":"P@ssw0rd"}'
curl -c jar.txt -b jar.txt localhost:3000/profile
curl -c jar.txt -b jar.txt -X POST localhost:3000/users/login -H "Content-Type: application/json" -d '{"name":"somchai","password":"P@ssw0rd"}'
curl -c jar.txt -b jar.txt localhost:3000/profile
curl -c jar.txt -b jar.txt localhost:3000/admin
curl -c jar.txt -b jar.txt -X POST localhost:3000/users -H "Content-Type: application/json" -d '{"name":"boss","password":"Admin@2026","role":"Admin"}'
curl -c jar.txt -b jar.txt -X POST localhost:3000/users/login -H "Content-Type: application/json" -d '{"name":"boss","password":"Admin@2026"}'
curl -c jar.txt -b jar.txt localhost:3000/admin
curl -c jar.txt -b jar.txt -X POST localhost:3000/logout
curl -c jar.txt -b jar.txt localhost:3000/profile
```

> ✅ **จุดเช็ค:** ผลตามลำดับ: `Created` → `Unauthorized` → `Success` → `{"name":"somchai","role":"Student"}` → `Forbidden` → `Created` → `Success` → `Welcome Admin` → `Logged out` → `Unauthorized`

---

## ภาคผนวก: ปัญหาที่เจอบ่อย

| อาการ / ข้อความ | สาเหตุ | วิธีแก้ |
|---|---|---|
| `npm.ps1 cannot be loaded because running scripts is disabled` | PowerShell ปิดการรันสคริปต์ | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `'node' is not recognized` | ยังไม่ติดตั้ง Node หรือยังไม่ปิด-เปิด VS Code ใหม่หลังติดตั้ง | ติดตั้ง Node LTS แล้วเปิด VS Code ใหม่ |
| `Error: listen EADDRINUSE: address already in use :::3000` | server ตัวเก่ายังรันอยู่ | ไปที่ terminal เก่ากด Ctrl+C (หรือปิด terminal นั้น) |
| Jest: `No tests found` | ชื่อไฟล์ไม่ลงท้าย `.test.js` | เปลี่ยนชื่อไฟล์ |
| `TypeError: xxx is not a function` | ลืม `module.exports` / export กับ require ไม่ตรงรูปแบบ | ตรวจคู่ export–require |
| `Error: Cannot find module '../config/db'` | path หรือชื่อโฟลเดอร์ใน require ไม่ตรง | เทียบกับโฟลเดอร์จริง (`configs`) |
| `Cannot GET /products` | route อยู่ใต้ `/api` | เรียก `/api/products` |
| `Error: Access denied for user 'appuser'@...` | user/password ใน `.env` ไม่ตรงฐานข้อมูล | แก้ `.env` / docker-compose ให้ตรงกัน |
| `Error: connect ECONNREFUSED 127.0.0.1:3306` | ฐานข้อมูลยังไม่รัน/ยังเปิดไม่เสร็จ | `docker compose up -d` แล้วรอ `ready for connections` |
| ภาษาไทยเป็น `à¹€à¸ª...` | import SQL ด้วย charset ผิด | ใช้ `init.sql` ที่มี `SET NAMES utf8mb4;` แล้ว `docker compose down -v` → `up -d` |
| `Failed to lookup view "products"` | ไฟล์ ejs ไม่อยู่ใน `views/` หรือชื่อไม่ตรง | ตรวจชื่อ/ตำแหน่ง |
| CSS ไม่ขึ้น | ลืม `express.static('public')` หรือ href มี `/public` | `href="/css/products.css"` |
| `blocked by CORS policy` | หน้าเว็บไม่ได้เปิดจาก `http://127.0.0.1:5500` | เปิดด้วย Live Server ให้ตรง origin |
| login แล้วยังได้ `Unauthorized` | fetch ไม่มี `credentials: "include"` | ใส่ทั้งใน login และ adminData |
| `ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent` | ส่ง response 2 ครั้ง (ลืม `return`) | `return res.sendStatus(...)` |
| `TypeError: Cannot read properties of undefined (reading 'sessionId')` | ลืม `app.use(cookieParser())` | เพิ่มก่อน routes |
| `Missing script: "dev"` | ยังไม่แก้ scripts ใน package.json | เพิ่ม `"dev": "node --watch server.js"` |
| Postman เรียก Codespaces ไม่ได้ | Port เป็น Private / Codespace หลับ / URL เปลี่ยน | ตั้ง Public, `make run-dev` ใหม่, อัปเดต `baseUrl` |
| Postman `422 Unprocessable Entity` | body ผิดรูปแบบ (status สะกดผิด, /token ส่งเป็น JSON) | ดู `detail` ใน response |