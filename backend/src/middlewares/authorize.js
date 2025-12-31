const authorize = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Admin bypass
    if (req.user.role === "admin") {
      return next();
    }

    // ✅ Permission check
    const permissions = req.user.permissions || [];
    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};

export default authorize;
