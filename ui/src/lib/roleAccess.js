export const routeAccessMap = {
  "^/$": ["admin"],
  "^/auth/users$": ["admin"],
  "^/auth/forget-password$": ["admin"],
  "^/auth/reset-password$": ["admin"],
  "^/auth/role-permission(/.*)?$": ["admin"],
  "^/blogs(/.*)?$": ["admin", "user"],
};

export const DEFAULT_REDIRECT = "/signin";
export const UNAUTHORIZED_REDIRECT = "/unauthorized";
