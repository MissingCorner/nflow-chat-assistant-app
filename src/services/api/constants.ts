export const API_URL = "/api";

export const API_ENDPOINTS = {
  CHAT: "/chat",
  CHAT_SESSIONS: "/chat-sessions",
  CHAT_MESSAGES: "/chat-messages",
  AUTH: {
    KEYCLOAK: {
      BASE: "/auth/keycloak",
      LOGIN: "/auth/keycloak/login",
      CALLBACK: "/auth/keycloak/callback",
      LOGOUT: "/auth/keycloak/logout",
      REFRESH: "/auth/keycloak/refresh",
      STATUS: "/auth/keycloak/status",
    },
  },
  HEALTH: "/health",
};
