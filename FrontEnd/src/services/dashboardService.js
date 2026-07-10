const API_GATEWAY_URL = import.meta.env.VITE_API_URL || "/api";

export async function getDashboardSummary(userId = "demo-user") {
  const response = await fetch(
    `${API_GATEWAY_URL}/dashboard/summary?user_id=${userId}`
  );

  if (!response.ok) {
    throw new Error("No se pudo cargar el dashboard");
  }

  return response.json();
}