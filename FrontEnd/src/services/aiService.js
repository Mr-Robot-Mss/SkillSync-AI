import { API_CONFIG } from "../config/apiConfig";

export async function askAssistant(message) {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.assistant}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );

  if (!response.ok) {
    throw new Error("Error consultando asistente IA");
  }

  const data = await response.json();
  return typeof data === "string" ? data : data.response || data.message || data;
}

export async function analyzeInterviewAnswer(answer, role = "QA Automation") {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.interviewEvaluate}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer, role }),
    }
  );

  if (!response.ok) {
    throw new Error("Error evaluando respuesta");
  }

  return response.json();
}

export async function generateCVAnalysis(role, skills = [], projects = []) {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cvAnalyze}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, skills, projects }),
    }
  );

  if (!response.ok) {
    throw new Error("Error analizando CV");
  }

  return response.json();
}

export async function getRoadmap() {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.roadmap}`
  );

  if (!response.ok) {
    throw new Error("Error obteniendo roadmap");
  }

  return response.json();
}