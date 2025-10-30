import cookie from "cookie";

let state = global.__STATE__ || {
  status: {},
  code: {},
  script_id: {},
};


function gen_scriptid() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

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


export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "https://8967.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();
    
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const path = pathname.toLowerCase();
    const users = getusernames();

    // i dont like json really
    let body = {};
    if (req.method !== "GET" && req.body) {
      body = req.body;
    } else if (req.method !== "GET") {
      try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString();
        if (raw) body = JSON.parse(raw);
      } catch { body = {}; }
    }

    const { user, password, value, code } = body;
    
    // login
    if (path.endsWith("/login")) {
      if (req.method !== "POST")
        return res.status(405).json({ error: "method not allowed" });
      if (!user || !password || !users[user] || password !== users[user]) {return res.status(403).json({ error: "wrong key" });}

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

    // logout
    if (path.endsWith("/logout")) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("auth", "", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          expires: new Date(0), // NOWWWWWWWW
        })
      );

      res.writeHead(302, { Location: "/" });
      return res.end();
    }

    //////////////////
    
    let auth_user = null;
    if (req.headers.cookie) {
      try {
        const cookies = cookie.parse(req.headers.cookie || "");
        if (cookies.auth) {
          const parsed = JSON.parse(decodeURIComponent(cookies.auth));
          if (users[parsed.user] && parsed.password === users[parsed.user]) {
            auth_user = parsed.user;
          }
        }
      } catch (err) {console.error("failed to parse cookie:", err);}
    }

    if (!auth_user && user && password && users[user] && password === users[user]) {auth_user = user;}
    if (!auth_user)
      return res.status(403).json({ error: "not authenticated" });

    //////////////////
    
    if (path.endsWith("/getstatus")) {
      const user_status = state.status[auth_user];
      let isctd = false;
      if (user_status) {
        isctd = user_status.value;
        if (Date.now() - user_status.lastUpdate > 15000) {
          state.status[auth_user].value = false;
          isctd = false;
        }
      }
      return res.status(200).json({ user: auth_user, status: isctd });
    }


    if (path.endsWith("/cstatus")) {
      if (req.method !== "POST")
        return res.status(405).json({ error: "method not allowed" });

      const new_status =
        typeof value !== "undefined"
          ? value === true || value === "true"
          : !state.status[auth_user]?.value;

      state.status[auth_user] = { value: new_status, lastUpdate: Date.now() };

      setTimeout(() => {
        const current = state.status[auth_user];
        if (current && Date.now() - current.lastUpdate >= 15000) {
          state.status[auth_user].value = false;
          state.code[auth_user] = "";
          state.script_id[auth_user] = "";
          global.__STATE__ = state;
        }
      }, 15000);

      global.__STATE__ = state;
      return res.status(200).json({
        user: auth_user,
        status: state.status[auth_user].value,
      });
    }

    if (path.endsWith("/ccode")) {
      if (req.method !== "POST")
        return res.status(405).json({ error: "method not allowed" });

      if (!code) return res.status(400).json({ error: "missing code" });

      state.code[auth_user] = code;
      const n_scid = gen_scriptid();
      state.script_id[auth_user] = n_scid;
      global.__STATE__ = state;

      return res.status(200).json({user: auth_user,code,"script-id": n_scid,});
    }

    

    return res.status(404).json({ error: "not found" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
}
