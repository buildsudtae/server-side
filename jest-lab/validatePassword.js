// Requirement: Password must contain at least 8 characters.
// Code II (ถูกต้อง) ใช้ >= ; Code I ในสไลด์ใช้ > ซึ่งผิดที่ boundary 8 ตัว
function validatePassword(password) {
  if (typeof password !== "string") {
    return false;
  }
  return password.length >= 8;
}

module.exports = validatePassword;
