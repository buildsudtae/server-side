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
