const API_GATEWAY_URL = "http://127.0.0.1:8000/api";

export async function getChileTechJobs() {
  const response = await fetch(`${API_GATEWAY_URL}/jobs/chile-tech`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las ofertas laborales");
  }

  return response.json();
}