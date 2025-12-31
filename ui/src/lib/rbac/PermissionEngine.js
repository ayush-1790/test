
class PermissionEngine {
  constructor(user) {
    this.user = user;
    this.permissions = new Set(user?.permissions || []);
    this.featureFlags = new Set(user?.featureFlags || []);
  }

  hasPermission(permission) {
    return this.permissions.has(permission);
  }

  hasAllPermissions(permissions) {
    return permissions.every((p) => this.permissions.has(p));
  }


  hasAnyPermission(permissions) {
    return permissions.some((p) => this.permissions.has(p));
  }

  isFeatureEnabled(flag) {
    return this.featureFlags.has(flag);
  }

  can(requirement, attributes = {}) {
    // Admin bypass: allow all permissions for admin role
    if (this.user?.role === 'admin') {
      return true;
    }

    if (typeof requirement === "string") {
      return this.hasPermission(requirement);
    }

    if (Array.isArray(requirement)) {
      return this.hasAllPermissions(requirement);
    }

    if (typeof requirement === "function") {
      return requirement(this.user, attributes);
    }

    return false;
  }
}

export default PermissionEngine;
