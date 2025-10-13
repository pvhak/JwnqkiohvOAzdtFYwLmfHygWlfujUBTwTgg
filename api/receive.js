import cors from "./_cors";
import { setstd } from "../lib/shared.js";
// (i had to remove it) haha.. get it? STD? like.. std?? Hahahha im so funny right? right???

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const { key } = req.query;
  if (key !== "test") return res.status(403).json({ error: "nooo" });
  if (req.method !== "POST") return res.status(405).json({ error: "not allowed lil NIGGA" });

  const { data } = req.body || {};
  if (!data) return res.status(400).json({ error: "?????" });

  setstd(data);
  res.status(200).json({ ok: true });
}
