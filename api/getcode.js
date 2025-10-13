let codes = global.__CODES__ || { fatguy7: "no code set" };
const verytuffkey = process.env.verytuffkey || "burger";

export default function handler(req, res) {
  const user = (req.query.user || "").toString();
  const key = (req.query.key || "").toString();

  if (!user || !key) {return res.status(400).json({ error: 'missing "user" or "key"' });}
  if (user !== 'fatguy7') {return res.status(404).json({ error: 'User not found!' });}
  if (key !== verytuffkey) {return res.status(403).json({ error: 'invalid password!' });}

  const code = codes[user] ?? "no code set";
  return res.status(200).json({ user, code });
}
