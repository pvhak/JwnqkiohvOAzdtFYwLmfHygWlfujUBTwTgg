import cors from "./_cors";
import { cstatus, setStatus } from "../lib/shared.js";

export default function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { key, value } = req.query;
  if (key !== "test") return res.status(403).json({ error: "nooo" });
  if (req.method === "POST") {
    if (value === "true") setstatus(true);
    else if (value === "false") setstatus(false);
    else return res.status(400).json({ error: "bad value" });
  }
  res.status(200).json({ status: cstatus });
}
