let std = ""; // haha.. get it? STD? like.. SToredData?? Hahahha im so funny right? right???

export default function handler(req, res) {
  const { key } = req.query;
  if (key !== "test") {return res.status(403).json({ error: "nooo" });}
  if (req.method !== "POST") {return res.status(405).json({ error: "not allowed lil NIGGA" });}

  const { data } = req.body;
  if (!data) {return res.status(400).json({ error: "?????" });}

  std = data;
  res.status(200).json({ success: true, received: data });
}

export { std };
