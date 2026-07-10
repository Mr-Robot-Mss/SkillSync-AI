const API_GATEWAY_URL = import.meta.env.VITE_API_URL || "/api";

export async function loginUser(email, password, rememberSession = true) {
  const response = await fetch(`${API_GATEWAY_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "No se pudo iniciar sesión");
  }

  const data = await response.json();

  const storage = rememberSession ? localStorage : sessionStorage;

  storage.setItem("skillsync_token", data.access_token);
  storage.setItem("skillsync_user", JSON.stringify(data.user));

  return data;
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_GATEWAY_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "No se pudo registrar el usuario");
  }

  return response.json();
}

export function getCurrentUser() {
  const user =
    localStorage.getItem("skillsync_user") ||
    sessionStorage.getItem("skillsync_user");

  return user ? JSON.parse(user) : null;
}

export function getToken() {
  return (
    localStorage.getItem("skillsync_token") ||
    sessionStorage.getItem("skillsync_token")
  );
}

export function logoutUser() {
  localStorage.removeItem("skillsync_token");
  localStorage.removeItem("skillsync_user");

  sessionStorage.removeItem("skillsync_token");
  sessionStorage.removeItem("skillsync_user");
}