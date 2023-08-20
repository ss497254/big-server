import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hi" + req.ip);
});

app.listen(port, () => console.log("Server http://localhost:" + port));
