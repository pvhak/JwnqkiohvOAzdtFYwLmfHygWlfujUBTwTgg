// [[...route]].js - thanks docs for this name
// /api/getstatus, /api/changestatus, /api/getcode, /api/ccode
// semi functional version??

import cookie from "cookie";

let state = global.__STATE__ || {
  status: {},
  code: {},
};

// tsts
function getusernames() {
  const env_data = process.env.MVZWK6DPOV2HA5LU || "";
  const lines = env_data.split(/\r?\n/).filter(Boolean);
  const users = {};
  for (const line of lines) {
    const [username, password] = line.split(":");
    if (username && password) users[username.trim()] = password.trim();
  }
  return users;
}

export default function handler(req, res) {
  // ------ cors headers
  res.setHeader("Access-Control-Allow-Origin", "https://8967.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  // ---------------------------
  
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const path = pathname.toLowerCase();
  const { user, password, value, code } = req.query;
  const users = getusernames();

if (path.endsWith("/login")) {
  if (!user || !password || !users[user] || password !== users[user]) {
    return res.status(403).json({ error: "wrong key" });
  }

  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(
      "auth",
      encodeURIComponent(JSON.stringify({ user, password })),
      {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        expires,
      }
    )
  );

  return res.status(200).json({ redirect: "/editor" });
}

  let auth_user = null;
  let auth_pass = null;

  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie || "");
    if (cookies.auth) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookies.auth));
        if (users[parsed.user] && parsed.password === users[parsed.user]) {
          auth_user = parsed.user;
          auth_pass = parsed.password;
        }
    } catch (err) {console.error("failed to parse cookie:", err);}
    }
  }


  // if no cookies then just fallback ok?
  if (!auth_user && user && password && users[user] && password === users[user]) {auth_user = user;auth_pass = password;}
  if (!auth_user) {return res.status(403).json({ error: "not authenticated" });}

  // --- handle routes ---
  if (path.endsWith("/getstatus")) {
    const user_status = state.status[auth_user];
    const isctd = user_status?.value || false;
    if (user_status && Date.now() - user_status.lastUpdate > 15000) {state.status[auth_user].value = false;}
    return res.status(200).json({ user: auth_user, status: state.status[auth_user].value });
  }

  if (path.endsWith("/cstatus")) {
    const new_status = value !== undefined ? value === "true" : !state.status[auth_user]?.value;
    state.status[auth_user] = { value: new_status, lastUpdate: Date.now() };

    setTimeout(() => {
      const current = state.status[auth_user];
      if (current && Date.now() - current.lastUpdate >= 15000) {
        state.status[auth_user].value = false;
        global.__STATE__ = state;
      }
    }, 15000);

    global.__STATE__ = state;
    return res.status(200).json({ user: auth_user, status: state.status[auth_user].value });
  }

  if (path.endsWith("/getcode")) {
    const message = state.code[auth_user] ?? "";
    return res.status(200).json({ user: auth_user, code: message });
  }

  if (path.endsWith("/ccode")) {
    if (!code)
      return res.status(400).json({ error: "missing code" });
    state.code[auth_user] = code;
    global.__STATE__ = state;
    return res.status(200).json({ user: auth_user, code: state.code[auth_user] });
  }

  // incase some retard goes to api/getporn or smth
  return res.status(404).json({ error: "https://nigger.gamer.gd/vixelfunk-feet.gif" });
}
