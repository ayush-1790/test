import Role from "../models/Role.js";

export const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // verifyUser middleware must run before this
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { role, permissions } = req.user;

      // ✅ Admin bypass
      if (role === "admin") {
        return next();
      }

      // ✅ Permission check
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
