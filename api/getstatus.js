let statuses = global.__STATUSES__ || { fatguy7: false };

export default function handler(req, res) {
  const user = (req.query.user || '').toString();
  if (!user) {return res.status(400).json({ error: 'missing "user"' });}
  if (user !== 'fatguy7') {return res.status(404).json({ error: 'who?' });}
  const status = !!statuses[user];
  return res.status(200).json({ user, status });
}

global.__STATUSES__ = statuses;
