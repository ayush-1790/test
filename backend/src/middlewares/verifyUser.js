import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET;

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decoded.id)
      .select("-password")
      .populate({
        path: "role",
        select: "name permissions",
        populate: {
          path: "permissions",
          select: "key",
        },
      });

    if (!user || !user.is_active) {
      return res.status(403).json({ message: "User inactive or not found" });
    }

    if (!user.role || !user.role.permissions) {
      // Allow user if they have no role? Probably not, but let's be safe.
      // If no role, they have no permissions.
      req.user = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: null,
        permissions: [],
      };
      return next();
    }

    // Extract permission keys
    const permissions = user.role.permissions.map((p) => p.key);

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      permissions: permissions,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
