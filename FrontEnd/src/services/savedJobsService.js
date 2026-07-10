const API_GATEWAY_URL = import.meta.env.VITE_API_URL || "/api";

export async function getSavedJobs() {
  const response = await fetch(`${API_GATEWAY_URL}/saved-jobs/all`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las ofertas guardadas");
  }

  return response.json();
}

export async function saveJob(job) {
  const response = await fetch(`${API_GATEWAY_URL}/saved-jobs/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar la oferta");
  }

  return response.json();
}

export async function removeSavedJob(jobId) {
  const response = await fetch(`${API_GATEWAY_URL}/saved-jobs/${jobId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar la oferta");
  }

  return response.json();
}