import { API_CONFIG } from "../config/apiConfig";

export async function getSavedJobs() {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.savedJobs}`
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function saveJob(job) {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.saveJob}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo guardar la oferta");
  }

  return response.json();
}

export async function removeSavedJob(jobId) {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.deleteSavedJob}/${jobId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo eliminar la oferta");
  }

  return response.json();
}

export async function isJobSaved(jobId) {
  const savedJobs = await getSavedJobs();
  return savedJobs.some((job) => job.job_id === jobId || job.id === jobId);
}

export async function toggleSavedJob(job) {
  const savedJobs = await getSavedJobs();
  const exists = savedJobs.some(
    (item) => item.job_id === job.id || item.id === job.id
  );

  if (exists) {
    await removeSavedJob(job.id);
  } else {
    await saveJob(job);
  }

  return getSavedJobs();
}