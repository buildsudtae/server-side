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
