let codes = global.__CODES__ || { fatguy7: "no code set" };
const verytuffkey = process.env.verytuffkey || "burger";

export default function handler(req, res) {
  const user = (req.query.user || "").toString();
  const key = (req.query.key || "").toString();
  const code = (req.query.code || "").toString();

  if (!user || !key) {return res.status(400).json({ error: 'missing "user" or "key"' });}
  if (user !== 'fatguy7') {return res.status(404).json({ error: 'User not found!' });}
  if (key !== verytuffkey) {return res.status(403).json({ error: 'invalid password!' });}
  if (!code) {return res.status(400).json({ error: 'no code' });}

  codes[user] = code;
  global.__CODES__ = codes;
  return res.status(200).json({ user, newCode: codes[user] });
}
