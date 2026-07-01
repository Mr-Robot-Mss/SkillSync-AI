import { useEffect, useState } from "react";
import { BookmarkCheck, BriefcaseBusiness, MapPin, Trash2 } from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";
import { getSavedJobs, removeSavedJob } from "../services/savedJobsService";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSavedJobs() {
      try {
        setLoading(true);
        const data = await getSavedJobs();
        setSavedJobs(data);
      } finally {
        setLoading(false);
      }
    }

    loadSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    await removeSavedJob(jobId);
    const updated = await getSavedJobs();
    setSavedJobs(updated);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Ofertas Guardadas"
          subtitle="Tus oportunidades laborales favoritas persistidas en Supabase"
        />

        <div className="p-6 lg:p-10">
          <section className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.22),transparent_28%)]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
                <BookmarkCheck size={16} />
                Saved Jobs
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                Ofertas guardadas
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
                Aquí se muestran las ofertas laborales guardadas desde el módulo
                de oportunidades, consultadas mediante API Gateway y Jobs Service.
              </p>
            </div>
          </section>

          <section className="mt-6">
            {loading ? (
              <div className="glass-card rounded-[28px] p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                <div className="mx-auto h-16 w-16 animate-pulse rounded-2xl bg-black" />
                <h2 className="mt-5 text-2xl font-black">Cargando ofertas guardadas</h2>
                <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-zinc-500">
                  Consultando API Gateway y Supabase.
                </p>
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="glass-card rounded-[28px] p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                  <BookmarkCheck size={28} />
                </div>

                <h2 className="mt-5 text-2xl font-black">
                  Aún no tienes ofertas guardadas
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-zinc-500">
                  Guarda ofertas desde la página de oportunidades laborales para
                  revisarlas después.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {savedJobs.map((job) => {
                  const skills = Array.isArray(job.skills) ? job.skills : [];

                  return (
                    <article
                      key={job.id}
                      className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                            <BriefcaseBusiness size={26} />
                          </div>

                          <div>
                            <h2 className="text-xl font-black">
                              {job.title || "Cargo no informado"}
                            </h2>

                            <p className="mt-1 text-sm font-bold text-zinc-500">
                              {job.company || "Empresa no informada"}
                            </p>

                            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-zinc-500">
                              <MapPin size={16} />
                              {job.location || "Chile"} · {job.modality || "No especificada"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-black px-5 py-4 text-center text-[#ffd500]">
                            <p className="text-3xl font-black">{job.match || 75}%</p>
                            <p className="text-xs font-black">Match IA</p>
                          </div>

                          <button
                            onClick={() => handleRemove(job.job_id || job.id)}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>

                      {skills.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}