// [[...route]].js - thanks docs for this name
// /api/getstatus, /api/changestatus, /api/getcode, /api/ccode
// semi functional version??

let state = global.__STATE__ || {
  status: {},
  code: {},
};

const verytuffkey = process.env.verytuffkey || "burger";

// parse this shit nigga
function getusernames() {
  const env_data = process.env.MVZWK6DPOV2HA5LU || "";

  console.log("raw");
  console.log(env_data);

  const lines = env_data.split(/\r?\n/).filter(Boolean);
  console.log("split lines");
  console.log(lines);

  const users = {};
  for (const line of lines) {
    const [username, password] = line.split(":");
    if (username && password) {
      users[username.trim()] = password.trim();
    } else {
      console.warn("malformed lines", line);
    }
  }

  console.log("parsed");
  console.log(users);
  return users;
}

export default function handler(req, res) {
  // ------ cors headers NIGGAAAA
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  // ---------------------------

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const path = pathname.toLowerCase();
  const { user, key, value, code, password } = req.query;
  const users = getusernames();

  // validation
  if (!user || !users[user]) { return res.status(404).json({ error: "user not found!" }); }
  if (password && password !== users[user]) { return res.status(403).json({ error: "wrong password" }); }

  // --- handle routes ---
  if (path.endsWith("/getstatus")) {
    const status = state.status[user] ?? false;
    return res.status(200).json({ user, status });
  }

  if (path.endsWith("/cstatus")) {
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
