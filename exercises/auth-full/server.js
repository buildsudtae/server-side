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
