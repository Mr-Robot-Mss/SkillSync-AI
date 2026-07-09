const API_GATEWAY_URL = "http://127.0.0.1:8000/api";

export async function analyzeCV(payload) {
  const response = await fetch(`${API_GATEWAY_URL}/cv/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo analizar el CV");
  }

  return response.json();
}

export async function optimizeCV(payload) {
  const response = await fetch(`${API_GATEWAY_URL}/cv/optimize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo optimizar el CV");
  }

  return response.json();
}