export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  OWNER: "owner",
} as const;

export const SENSOR_THRESHOLDS = {
  PH: {
    MIN: 5.5,
    MAX: 7.5,
    WARNING_MIN: 5.0,
    WARNING_MAX: 8.0,
  },
  MOISTURE: {
    MIN: 40,
    MAX: 80,
    WARNING_MIN: 30,
    WARNING_MAX: 90,
  },
  TEMPERATURE: {
    MIN: 20,
    MAX: 35,
    WARNING_MIN: 15,
    WARNING_MAX: 40,
  },
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ABOUT: "/about",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  DASHBOARD: "/dashboard",
  DATA: "/data",
  CAMERA: "/camera",
  FORUM: "/forumEdukasi",
  MESSAGE: "/message",
  PROFILE: "/profile",

  ADMIN_DASHBOARD: "/dashboard_admin",
  USER_MANAGEMENT: "/user-management",
  CONTENT: "/content",
  CHILIES: "/chilies",
  ADMIN_MESSAGE: "/admin-message",
  TEMPLATES: "/templates",

  OWNER_DASHBOARD: "/dashboard_owner",
  EXPORT: "/export",
  OPERATIONAL: "/operational",
  OWNER_MESSAGE: "/owner-message",
} as const;

export const DISABLE_NAVIGATION_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;



