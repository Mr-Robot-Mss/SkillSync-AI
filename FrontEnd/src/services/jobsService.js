const API_GATEWAY_URL =
  import.meta.env.VITE_API_URL || "/api";


async function parseResponse(
  response,
  fallbackMessage
) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      typeof data?.detail === "string"
        ? data.detail
        : data?.message ||
          fallbackMessage;

    throw new Error(detail);
  }

  return data;
}


export async function getChileTechJobs() {
  const response = await fetch(
    `${API_GATEWAY_URL}/jobs/chile-tech`
  );

  const data = await parseResponse(
    response,
    "No se pudieron obtener las ofertas laborales"
  );

  return Array.isArray(data)
    ? data
    : data?.jobs || [];
}


export async function getRecommendedJobs(
  primaryRole = "Data Analyst"
) {
  const params = new URLSearchParams({
    primary_role: primaryRole,
  });

  const response = await fetch(
    `${API_GATEWAY_URL}/jobs/recommended?${params.toString()}`
  );

  const data = await parseResponse(
    response,
    "No se pudieron obtener las ofertas recomendadas"
  );

  return Array.isArray(data)
    ? data
    : data?.jobs || [];
}


export async function syncJobs() {
  const response = await fetch(
    `${API_GATEWAY_URL}/jobs/sync`,
    {
      method: "POST",
    }
  );

  return parseResponse(
    response,
    "No se pudieron sincronizar las ofertas"
  );
}