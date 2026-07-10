const API_GATEWAY_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

function extractErrorMessage(
  data,
  fallbackMessage
) {
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  if (
    Array.isArray(data?.detail) &&
    data.detail.length > 0
  ) {
    return data.detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(", ");
  }

  if (
    data?.detail &&
    typeof data.detail === "object"
  ) {
    try {
      return JSON.stringify(data.detail);
    } catch {
      return fallbackMessage;
    }
  }

  return fallbackMessage;
}

export async function analyzeProfile(
  payload
) {
  const response = await fetch(
    `${API_GATEWAY_URL}/onboarding/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(
        data,
        "No se pudo analizar el perfil."
      )
    );
  }

  return data;
}