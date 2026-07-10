const API_GATEWAY_URL = import.meta.env.VITE_API_URL || "/api";

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