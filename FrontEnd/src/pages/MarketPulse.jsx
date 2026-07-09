import { useEffect, useState } from "react";
import { getChileTechJobs } from "../services/jobsService";
import { saveJob } from "../services/savedJobsService";

export default function MarketPulse() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getChileTechJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar ofertas laborales");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job) => {
    try {
      await saveJob(job);
      setSavedMessage(`Oferta guardada: ${job.title}`);
    } catch (err) {
      setSavedMessage(err.message || "No se pudo guardar la oferta");
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-2">Market Pulse</h1>

      <p className="text-gray-600 mb-6">
        Ofertas tecnológicas reales disponibles en Chile, cargadas desde el jobs-service.
      </p>

      {savedMessage && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 text-green-700 p-4">
          {savedMessage}
        </div>
      )}

      {loading && <p className="text-gray-500">Cargando ofertas laborales...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-gray-500">No existen ofertas laborales disponibles.</p>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid gap-4">
          {jobs.map((job, index) => (
            <div
              key={job.id || job.external_id || index}
              className="border rounded-xl p-4 shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold">
                {job.title || "Oferta sin título"}
              </h2>

              <p className="text-gray-700">{job.company || "Empresa no informada"}</p>
              <p className="text-gray-500">{job.location || "Ubicación no informada"}</p>

              <p className="mt-2 text-sm text-gray-700">
                {job.description || "Sin descripción disponible."}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                  {job.category || "Tech"}
                </span>

                <span className="text-sm bg-green-100 px-2 py-1 rounded">
                  Match {job.match ?? 75}%
                </span>

                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {job.source || "Jobs Service"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Ver oferta
                  </a>
                )}

                <button
                  onClick={() => handleSaveJob(job)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Guardar oferta
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}