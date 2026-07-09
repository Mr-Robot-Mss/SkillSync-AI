const API_GATEWAY_URL = "http://127.0.0.1:8000/api";

export async function getMyRoadmap(userId = "demo-user") {
  const response = await fetch(
    `${API_GATEWAY_URL}/roadmap/my-roadmap?user_id=${userId}`
  );

  if (!response.ok) {
    throw new Error("No se pudo obtener el roadmap");
  }

  return response.json();
}