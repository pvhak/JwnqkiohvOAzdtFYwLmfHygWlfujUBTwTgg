let tststs = false;

export default function handler(req, res) {
  const { key, value } = req.query;
  if (key !== "test") {return res.status(403).json({ error: "nooo" });}

  if (req.method === "POST") {
    if (value === "true") {
      tststs = true;
    } else if (value === "false") {
      tststs = false;
    } else {
      return res.status(400).json({ error: "?" });
    }

    return res.status(200).json({ success: true, status: tststs });
  }

  if (req.method === "GET") {return res.status(200).json({ status: tststs });}
  return res.status(405).json({ error: "not allowed lil NIGGA" });
}

export { tststs };
