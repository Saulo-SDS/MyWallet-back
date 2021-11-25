import jwt from "jsonwebtoken";

async function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).send("No token provided");

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) return res.status(500).send("Failed to authenticate token");

    req.id = decoded.id;
    next();
  });
}

export default auth;
