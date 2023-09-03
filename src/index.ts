import express from "express";

const app = express();

app.get("/", (_req, res) => res.send("jo"));

app.listen(process.env.PORT || 8080, () =>
  console.log("started", process.env.PORT)
);
