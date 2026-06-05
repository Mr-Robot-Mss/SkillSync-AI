import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

const userSkills = [
  "Python",
  "SQL",
  "Power BI",
  "Postman",
  "Testing",
];

const demandedSkills = [
  "React",
  "Node.js",
  "Docker",
  "AWS",
  "Selenium",
  "Python",
  "SQL",
  "Power BI",
];

export default function SkillGap() {
  const missingSkills = demandedSkills.filter(
    (skill) => !userSkills.includes(skill)
  );

  const compatibility = Math.round(
    (userSkills.length / demandedSkills.length) * 100
  );

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Skill Gap Analysis"
          subtitle="Análisis inteligente de brechas profesionales"
        />

        <div className="p-6 lg:p-10">
          <section className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.22),transparent_28%)]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
                <Brain size={16} />
                AI Skill Analysis
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                Brecha de habilidades
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
                Analizamos tus habilidades actuales versus las más demandadas
                por el mercado tecnológico en Chile.
              </p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-3">
            <KpiCard
              icon={TrendingUp}
              label="Compatibilidad"
              value={`${compatibility}%`}
              detail="Con el mercado actual"
            />

            <KpiCard
              icon={CheckCircle2}
              label="Skills actuales"
              value={userSkills.length}
              detail="Detectadas en tu perfil"
            />

            <KpiCard
              icon={AlertTriangle}
              label="Skills faltantes"
              value={missingSkills.length}
              detail="Recomendadas para mejorar"
            />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                  <CheckCircle2 size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Tus habilidades
                  </h2>

                  <p className="text-sm font-bold text-zinc-500">
                    Skills detectadas actualmente
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {userSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-black px-4 py-2 text-sm font-black text-[#ffd500]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white">
                  <AlertTriangle size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Skills recomendadas
                  </h2>

                  <p className="text-sm font-bold text-zinc-500">
                    Tecnologías con mayor demanda
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[32px] bg-black p-8 text-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffd500] text-black">
                <Sparkles size={30} />
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Recomendación IA
                </h2>

                <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-zinc-300">
                  Tu perfil tiene una fuerte orientación a QA, análisis de datos
                  e inteligencia de negocios. Aprender Docker, React y AWS
                  podría aumentar significativamente tu compatibilidad con
                  ofertas Fullstack y Cloud en Chile.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function KpiCard({ icon: Icon, label, value, detail }) {
  return (
    <section className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
        <Icon size={24} />
      </div>

      <p className="text-sm font-black uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-4xl font-black">{value}</p>

      <p className="mt-2 text-sm font-bold text-zinc-500">
        {detail}
      </p>
    </section>
  );
}