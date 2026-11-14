const loginAsStudentBtn = document.getElementById("login-student");
const loginAsLecturerBtn = document.getElementById("login-lecturer");
const loginAsAdminBtn = document.getElementById("login-admin");
const adminBtn = document.getElementById("admin");
const logoutBtn = document.getElementById("logout");
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

logoutBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.text())
    .then((data) => (responsesDiv.textContent = data));
});
