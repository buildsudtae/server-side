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
