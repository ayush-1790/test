import jwt from "jsonwebtoken";
import Token from "../models/Token.js";

export const verifyStoredToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid token format" });

    const storedToken = await Token.findOne({ token });
    if (!storedToken)
      return res.status(401).json({ message: "Token not found in DB" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(401).json({ message: "Token verification failed" });
      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
