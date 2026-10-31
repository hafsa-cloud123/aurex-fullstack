// One small helper for ALL requests to our backend.
// It adds the JWT token automatically, so components stay clean.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const TOKEN_KEY = "aurex_token";

async function request(path, method = "GET", body) {
  const token = localStorage.getItem(TOKEN_KEY);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check your internet or try again.");
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // response had no JSON body
  }

  if (!response.ok) {
    // Token expired or invalid -> tell the app to log the user out
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event("auth:logout"));
    }
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, "POST", body),
  put: (path, body) => request(path, "PUT", body),
  delete: (path) => request(path, "DELETE"),
};
