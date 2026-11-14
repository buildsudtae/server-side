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
