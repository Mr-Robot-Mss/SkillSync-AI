import { API_CONFIG } from "../config/apiConfig";

export async function analyzeProfile(data) {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.onboardingAnalyze}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Error analizando perfil");
  }

  return response.json();
}