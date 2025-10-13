let statuses = global.__STATUSES__ || { fatguy7: false };
const verytuffkey = process.env.verytuffkey || 'burger';

export default function handler(req, res) {
  const user = (req.query.user || '').toString();
  const key = (req.query.key || '').toString();
  const value = req.query.value;
  
  if (!user || !key) {return res.status(400).json({ error: 'Missing "user" or "key" query parameter' });}
  if (user !== 'fatguy7') {return res.status(404).json({ error: 'User not found' });}
  if (key !== verytuffkey) {return res.status(403).json({ error: 'Invalid admin key' });}

  if (value === undefined) {statuses[user] = !statuses[user];} else {statuses[user] = value === 'true';}
  global.__STATUSES__ = statuses;
  return res.status(200).json({ user, newStatus: statuses[user] });
}
