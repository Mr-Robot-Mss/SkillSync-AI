import { API_CONFIG } from "../config/apiConfig";

function normalizeJob(job, index) {
  return {
    id: job.id || job.job_id || index + 1,
    title: job.title || "Cargo no informado",
    company: job.company || "Empresa no informada",
    location: job.location || "Chile",
    region: job.region || "Metropolitana",
    modality: job.modality || "No especificada",
    seniority: job.seniority || "No especificada",
    category: job.category || "Tech",
    salary: job.salary || "Sueldo no informado",
    source: job.source || "Supabase",
    match: job.match || 75,
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.description || "Descripción no disponible.",
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    url: job.url || null,
  };
}

export async function getChileTechJobs() {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.chileTechJobs}`
  );

  if (!response.ok) {
    throw new Error("No se pudieron obtener las ofertas laborales");
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data.map(normalizeJob);
  }

  if (Array.isArray(data.jobs)) {
    return data.jobs.map(normalizeJob);
  }

  return [];
}

export async function getRecommendedJobs(primaryRole = "Data Analyst") {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.recommendedJobs}?primary_role=${encodeURIComponent(primaryRole)}`
  );

  if (!response.ok) {
    throw new Error("No se pudieron obtener recomendaciones");
  }

  const data = await response.json();
  return data.jobs ? data.jobs.map(normalizeJob) : [];
}

export async function syncJobs() {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.syncJobs}`,
    { method: "POST" }
  );

  if (!response.ok) {
    throw new Error("No se pudieron sincronizar las ofertas");
  }

  return response.json();
}