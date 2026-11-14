const express = require("express");
const app = express();

app.use(express.json());          // อ่าน JSON body -> req.body

app.get("/hello/:name", (req, res) => {
  res.json({ msg: `Hello ${req.params.name}`, q: req.query });
});

app.post("/items", (req, res) => {
  res.status(201).json(req.body);
});

app.listen(3000, () => console.log("http://localhost:3000"));
