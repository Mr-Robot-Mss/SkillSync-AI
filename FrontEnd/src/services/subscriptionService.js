const API_GATEWAY_URL = "http://127.0.0.1:8000/api";

export async function activatePremium(userId = "demo-user") {
  const response = await fetch(
    `${API_GATEWAY_URL}/subscriptions/activate-premium?user_id=${userId}`,
    { method: "POST" }
  );

  if (!response.ok) {
    throw new Error("No se pudo activar Premium");
  }

  return response.json();
}