import axios from "axios";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

export const BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_URL || "");
export const ADMIN_TOKEN_KEY = "admin_token";
export const USER_TOKEN_KEY = "user_token";
const LEGACY_ADMIN_TOKEN_KEY = "token";
const LEGACY_MEMBER_SESSION_KEY = "mywebsite_session";
const ADMIN_API_PREFIXES = [
  "/api/admin",
  "/api/members",
  "/api/payments",
  "/api/attendance",
  "/api/existing-members",
  "/api/send",
  "/api/plans",
];

const api = axios.create({
  baseURL: BASE_URL || undefined,
  withCredentials: true,   // Cookie-based auth still works for same-domain setups
});



const parseStoredSession = (value) => {
  if (!value || value === "undefined" || value === "null") {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "string") {
      return JSON.parse(parsed);
    }
    return parsed;
  } catch (error) {
    return null;
  }
};

const readTokenValue = (key) => {
  const value = localStorage.getItem(key);
  if (!value || value === "undefined" || value === "null") {
    return null;
  }
  return value;
};

const getStoredToken = () => {
  const sessionValue = localStorage.getItem(LEGACY_MEMBER_SESSION_KEY);
  const session = parseStoredSession(sessionValue);
  if (session && typeof session === "object") {
    return session.access || session.token || null;
  }

  return sessionValue;
};

const getRequestPath = (config) => {
  const requestUrl = config?.url || "";

  try {
    const base = BASE_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return new URL(requestUrl, base).pathname;
  } catch (error) {
    return requestUrl;
  }
};

const isAdminRequest = (config) => {
  const requestPath = getRequestPath(config);
  return ADMIN_API_PREFIXES.some((prefix) => requestPath.startsWith(prefix));
};

const getTokenForRequest = (config) => {
  if (isAdminRequest(config)) {
    return readTokenValue(ADMIN_TOKEN_KEY) || readTokenValue(LEGACY_ADMIN_TOKEN_KEY);
  }

  return readTokenValue(USER_TOKEN_KEY) || getStoredToken();
};

const attachAuthHeaders = (config) => {
  const token = getTokenForRequest(config);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
};

api.interceptors.request.use(attachAuthHeaders);
axios.interceptors.request.use(attachAuthHeaders);

export default api;
