import { getCurrentUser } from "./authService";

const API_GATEWAY_URL = import.meta.env.VITE_API_URL || "/api";

function getAuthenticatedUserId() {
  const user = getCurrentUser();

  if (!user?.id) {
    throw new Error("No existe un usuario autenticado");
  }

  return user.id;
}

async function parseResponse(response, fallbackMessage) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      typeof data?.detail === "string"
        ? data.detail
        : data?.detail?.detail ||
          data?.message ||
          fallbackMessage;

    throw new Error(detail);
  }

  return data;
}

export async function getMyProfile() {
  const userId = getAuthenticatedUserId();

  const response = await fetch(
    `${API_GATEWAY_URL}/profile/${encodeURIComponent(userId)}`
  );

  return parseResponse(
    response,
    "No se pudo obtener el perfil"
  );
}

export async function updateMyProfile(profileData) {
  const userId = getAuthenticatedUserId();

  const response = await fetch(
    `${API_GATEWAY_URL}/profile/${encodeURIComponent(userId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  return parseResponse(
    response,
    "No se pudo actualizar el perfil"
  );
}

export async function updateMyAbout(aboutMe) {
  const userId = getAuthenticatedUserId();

  const response = await fetch(
    `${API_GATEWAY_URL}/profile/${encodeURIComponent(userId)}/about`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        about_me: aboutMe,
      }),
    }
  );

  return parseResponse(
    response,
    "No se pudo actualizar la descripción"
  );
}

export async function uploadMyAvatar(file) {
  const userId = getAuthenticatedUserId();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_GATEWAY_URL}/profile/${encodeURIComponent(userId)}/avatar`,
    {
      method: "POST",
      body: formData,
    }
  );

  return parseResponse(
    response,
    "No se pudo subir la imagen"
  );
}