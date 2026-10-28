// One place for every HTTP call to the backend.
// - Adds the JWT token to each request
// - Turns error responses into ApiError (with field errors for forms)
// - If the token is rejected (401), clears it and tells AuthContext to log out
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
const TOKEN_KEY = 'stp_token';

// NOTE: localStorage is simple and fine for a college project. Production apps
// often use httpOnly cookies instead so JavaScript cannot read the token.
export const tokenStorage = {
  get() {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set(token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage blocked */ }
  },
  clear() {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage blocked */ }
  },
};

export class ApiError extends Error {
  constructor(status, message, errors = {}) {
    super(message);
    this.status = status; // 0 = server not reachable
    this.errors = errors; // { fieldName: 'message' } from server validation
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const token = tokenStorage.get();
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Make sure the backend is running (npm run dev).');
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && token) {
      tokenStorage.clear();
      window.dispatchEvent(new Event('auth:expired'));
    }
    throw new ApiError(response.status, data?.message ?? `Request failed (${response.status}).`, data?.errors ?? {});
  }
  return data;
}

// Builds "?sport=CRICKET&teamId=t1", skipping empty values and 'ALL'.
export function toQuery(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== 'ALL');
  return entries.length ? `?${new URLSearchParams(entries)}` : '';
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
