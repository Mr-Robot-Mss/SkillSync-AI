import { useEffect, useState } from "react";
import {
  Map,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  TrendingUp,
  Lock,
  ExternalLink,
} from "lucide-react";

import { activatePremium } from "../services/subscriptionService";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";
import { getMyRoadmap } from "../services/roadmapService";

export default function CareerRoadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyRoadmap("demo-user");
      setRoadmap(data);
    } catch (err) {
      setError(err.message || "Error al cargar roadmap IA");
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePremium = async () => {
    try {
      setPremiumLoading(true);
      setError("");
      setMessage("");

      await activatePremium("demo-user");
      setMessage("Premium activado correctamente. Roadmap actualizado.");
      await loadRoadmap();
    } catch (err) {
      setError(err.message || "No se pudo activar Premium");
    } finally {
      setPremiumLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Career Roadmap"
          subtitle="Ruta profesional recomendada por IA"
        />

        <div className="p-6 lg:p-10">
          <section className="rounded-[32px] bg-black p-8 text-white shadow-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
              <Map size={16} /> AI Career Path
            </div>

            <h1 className="text-5xl font-black">
              Ruta de crecimiento profesional
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
              Camino recomendado según tu perfil, mercado laboral y brechas de
              habilidades.
            </p>
          </section>

          {message && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
              {message}
            </div>
          )}

          {loading && (
            <section className="mt-6 glass-card rounded-[28px] p-8 text-center shadow-xl">
              <h2 className="text-2xl font-black">Cargando roadmap IA...</h2>
            </section>
          )}

          {error && (
            <section className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-black">{error}</p>
            </section>
          )}

          {!loading && !error && roadmap && (
            <>
              <section className="mt-6 grid gap-4 lg:grid-cols-3">
                <MetricCard
                  icon={Target}
                  title="Rol objetivo"
                  value={roadmap.target_role}
                />
                <MetricCard
                  icon={TrendingUp}
                  title="Compatibilidad actual"
                  value={`${roadmap.current_compatibility}%`}
                />
                <MetricCard
                  icon={TrendingUp}
                  title="Meta"
                  value={`${roadmap.target_compatibility}%`}
                />
              </section>

              <section className="mt-6 glass-card rounded-[28px] p-8 shadow-xl">
                <h2 className="text-2xl font-black">Habilidades foco</h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {roadmap.focus?.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-black px-4 py-2 text-xs font-black text-[#ffd500]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className="mt-6 glass-card rounded-[28px] p-8 shadow-xl">
                <div className="space-y-6">
                  {roadmap.steps?.map((step, index) => {
                    const done = index < 2;

                    return (
                      <div
                        key={`${step.week}-${step.title}`}
                        className="flex gap-5 rounded-3xl bg-white p-5 shadow-sm"
                      >
                        <div className="mt-1">
                          {done ? (
                            <CheckCircle2 className="text-green-500" />
                          ) : (
                            <Circle className="text-zinc-300" />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-xs font-black uppercase text-zinc-400">
                            {step.week}
                          </p>

                          <h2 className="mt-1 text-2xl font-black">
                            {step.title}
                          </h2>

                          <p className="mt-2 text-sm font-bold text-zinc-500">
                            {step.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#ffd500]/20 px-3 py-1 text-xs font-black text-black">
                              Prioridad {step.priority}/5
                            </span>

                            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-600">
                              {step.status || "Pendiente"}
                            </span>
                          </div>

                          {step.resource && (
                            <a
                              href={step.resource}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:underline"
                            >
                              Ver recurso <ExternalLink size={15} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="mt-6 rounded-[28px] bg-black p-6 text-white shadow-2xl">
                <Sparkles className="text-[#ffd500]" />

                <h2 className="mt-4 text-2xl font-black">
                  Recomendación IA
                </h2>

                <p className="mt-3 text-sm font-medium leading-7 text-zinc-300">
                  {roadmap.market_insight}
                </p>
              </section>

              {roadmap.premium_message && (
                <section className="mt-6 rounded-[28px] border border-[#ffd500] bg-[#fff8cc] p-6 shadow-xl">
                  <div className="flex items-center gap-2 text-sm font-black">
                    <Lock size={18} />
                    Premium $2.500
                  </div>

                  <p className="mt-3 text-sm font-bold leading-7 text-zinc-700">
                    {roadmap.premium_message}
                  </p>

                  <button
                    onClick={handleActivatePremium}
                    disabled={premiumLoading}
                    className="mt-5 rounded-full bg-black px-6 py-3 text-sm font-black text-[#ffd500] disabled:opacity-60"
                  >
                    {premiumLoading ? "Activando..." : "Activar Premium $2.500"}
                  </button>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function MetricCard({ icon: Icon, title, value }) {
  return (
    <div className="glass-card rounded-[28px] p-6 shadow-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
        <Icon size={22} />
      </div>

      <p className="mt-4 text-sm font-black uppercase text-zinc-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}