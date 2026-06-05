import {
  BarChart3,
  TrendingUp,
  BriefcaseBusiness,
  Brain,
  Target,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

const analytics = [
  { label: "Compatibilidad promedio", value: "89%", icon: Target },
  { label: "Ofertas analizadas", value: "248", icon: BriefcaseBusiness },
  { label: "Skills detectadas", value: "32", icon: Brain },
  { label: "Crecimiento perfil", value: "+12%", icon: TrendingUp },
];

const trends = [
  { month: "Ene", value: 62 },
  { month: "Feb", value: 68 },
  { month: "Mar", value: 71 },
  { month: "Abr", value: 79 },
  { month: "May", value: 84 },
  { month: "Jun", value: 89 },
];

export default function Analytics() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Analytics"
          subtitle="Métricas inteligentes de empleabilidad y evolución profesional"
        />

        <div className="p-6 lg:p-10">
          <section className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.22),transparent_28%)]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
                <BarChart3 size={16} />
                Career Analytics
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                Panel analítico profesional
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
                Visualiza indicadores clave sobre empleabilidad, evolución del
                perfil, habilidades y compatibilidad con el mercado laboral.
              </p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-4">
            {analytics.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                    <Icon size={24} />
                  </div>

                  <p className="text-sm font-black uppercase tracking-wide text-zinc-500">
                    {item.label}
                  </p>

                  <p className="mt-2 text-4xl font-black">{item.value}</p>
                </article>
              );
            })}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <div className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <h2 className="text-2xl font-black">Evolución del perfil</h2>

              <div className="mt-8 flex h-72 items-end gap-5">
                {trends.map((item) => (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-3">
                    <div
                      className="w-full rounded-t-2xl bg-[#ffd500]"
                      style={{ height: `${item.value * 2}px` }}
                    />

                    <p className="text-xs font-black text-zinc-500">
                      {item.month}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-black p-6 text-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
              <h2 className="text-2xl font-black text-[#ffd500]">
                Insight IA
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-zinc-300">
                El perfil muestra crecimiento sostenido durante los últimos
                meses. La mayor oportunidad de mejora está en reforzar
                habilidades de backend, testing automatizado y cloud.
              </p>

              <div className="mt-6 space-y-4">
                <Insight label="Mayor fortaleza" value="Análisis de datos" />
                <Insight label="Skill emergente" value="QA Automation" />
                <Insight label="Próximo foco" value="Docker + Cloud" />
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Insight({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs font-bold uppercase text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}