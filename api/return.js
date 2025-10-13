import { std } from "./receive.js"; // look in receive.js to get this.. haha.. im so funny......
import { cstatus } from "./status.js";

export default function handler(req, res) {
  const { key } = req.query;
  if (key !== "test") {return res.status(403).json({ error: "nooo" });}
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(`Status: ${cstatus}\nData: ${std || "no data"}`);
}
