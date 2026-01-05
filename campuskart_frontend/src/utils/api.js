const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const ACCESS_TOKEN_KEY = "ck_access_token";
const REFRESH_TOKEN_KEY = "ck_refresh_token";

const withBaseUrl = (path) => {
  if (path.startsWith("http")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }
  return `${API_BASE_URL}/${path}`;
};

export const getStoredTokens = () => ({
  access: localStorage.getItem(ACCESS_TOKEN_KEY),
  refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
});

export const cacheTokens = (access, refresh) => {
  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  }
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  if (
    response.status === 204 ||
    !contentType ||
    !contentType.includes("application/json")
  ) {
    return null;
  }
  return response.json();
};

const refreshAccessToken = async () => {
  const { refresh } = getStoredTokens();
  if (!refresh) {
    return null;
  }

  const response = await fetch(withBaseUrl("/token/refresh/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = await response.json();
  if (data?.access) {
    cacheTokens(data.access, data.refresh ?? refresh);
    return data.access;
  }

  return null;
};

export const apiFetch = async (path, options = {}, requireAuth = false) => {
  const requestInit = { ...options };
  requestInit.headers = new Headers(options.headers || {});

  if (!(requestInit.body instanceof FormData)) {
    requestInit.headers.set("Accept", "application/json");
  }

  if (requireAuth) {
    const { access } = getStoredTokens();
    if (!access) {
      throw new Error("Authentication required");
    }
    requestInit.headers.set("Authorization", `Bearer ${access}`);
  }

  let response = await fetch(withBaseUrl(path), requestInit);

  if (response.status === 401 && requireAuth) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      requestInit.headers.set("Authorization", `Bearer ${refreshedToken}`);
      response = await fetch(withBaseUrl(path), requestInit);
    }
  }

  if (!response.ok) {
    const errorPayload = await parseResponse(response);
    const error = new Error(errorPayload?.detail || "Request failed");
    error.status = response.status;
    error.payload = errorPayload;
    throw error;
  }

  return parseResponse(response);
};

export const authApi = {
  login: async (email, password) => {
    const data = await apiFetch("/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    cacheTokens(data?.access, data?.refresh);
    return data;
  },
  register: async (formData) => {
    let payload = formData;
    let headers = {};

    if (!(formData instanceof FormData)) {
      payload = JSON.stringify(formData);
      headers = { "Content-Type": "application/json" };
    }

    const data = await apiFetch("/register/", {
      method: "POST",
      headers,
      body: payload,
    });

    return data;
  },
  profile: async () => apiFetch("/profile/", {}, true),
};

export default apiFetch;
