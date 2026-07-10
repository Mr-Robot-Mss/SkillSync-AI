const API_GATEWAY_URL = import.meta.env.VITE_API_URL || "/api";

export async function askAssistant(message, userId = "demo-user") {
  const response = await fetch(`${API_GATEWAY_URL}/ai/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      message,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Error consultando asistente IA");
  }

  return response.json();
}

export async function analyzeInterviewAnswer(
  answer,
  role = "QA Automation"
) {
  const response = await fetch(
    `${API_GATEWAY_URL}/interview/evaluate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
        role,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || "No se pudo evaluar la respuesta"
    );
  }

  return response.json();
}

export async function generateInterviewQuestion(
  role = "QA Automation"
) {
  const response = await fetch(
    `${API_GATEWAY_URL}/interview/question`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || "No se pudo generar la pregunta"
    );
  }

  return response.json();
}

export async function analyzeCV(payload) {
  const response = await fetch(`${API_GATEWAY_URL}/cv/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "No se pudo analizar el CV");
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "No se pudo optimizar el CV");
  }

  return response.json();
}

export async function getSkillGap() {
  const response = await fetch(`${API_GATEWAY_URL}/ai/skill-gap`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || "No se pudo obtener el análisis de brechas"
    );
  }

  return response.json();
}