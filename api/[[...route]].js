// [[...route]].js - thanks docs for this name
// /api/getstatus, /api/changestatus, /api/getcode, /api/ccode
// btw this is just testing
let state = global.__STATE__ || {
  status: { fatguy7: false },
  code: { fatguy7: "no code set" },
};

const verytuffkey = process.env.verytuffkey || "burger";
const usernameok = "fatguy7";

export default function handler(req, res) {
  // ------ cors headers NIGGAAAA
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  // ---------------------

  const path = (req.url.split("?")[0] || "").toLowerCase();
  const { user, key, value, code } = req.query;

  // does this nigga exist?
  if (!user || user !== usernameok) {
    return res.status(404).json({ error: "user not found!" });
  }

  // ------ routs
  if (path.endsWith("/getstatus")) {
    const status = state.status[user] ?? false;
    return res.status(200).json({ user, status });
  }

  if (path.endsWith("/cstatus")) { // c stands for change btw
    if (key !== verytuffkey)
      return res.status(403).json({ error: "wrong password" });
    if (value !== undefined) {state.status[user] = value === "true";} else {state.status[user] = !state.status[user];}
    global.__STATE__ = state;
    return res.status(200).json({ user, status: state.status[user] });
  }

  if (path.endsWith("/getcode")) {
    if (key !== verytuffkey)
      return res.status(403).json({ error: "wrong password" });
    const message = state.code[user] ?? "nothing";
    return res.status(200).json({ user, code: message });
  }

  if (path.endsWith("/ccode")) {
    if (key !== verytuffkey)
      return res.status(403).json({ error: "wrong password" });
    if (!code)
      return res.status(400).json({ error: 'missing code' });
    state.code[user] = code;
    global.__STATE__ = state;
    return res.status(200).json({ user, code: state.code[user] });
  }

  // incase some retard goes api/getporn or smth
  return res.status(404).json({ error: "invalid endpoint" });
}
