import cors from "./_cors"; // i hate u cors
import { std } from "./receive"; // look in receive.js to get this.. haha.. im so funny......
import { cstatus } from "./status";

export default function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { key } = req.query;
  if (key !== "test") {return res.status(403).json({ error: "nooo" });}
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(`Status: ${cstatus}\nData: ${std || "no data"}`);
}
