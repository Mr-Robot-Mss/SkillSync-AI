import { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Wand2,
  CheckCircle2,
} from "lucide-react";

import { generateCVAnalysis } from "../services/aiService";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

export default function CVBuilder() {
  const [role, setRole] = useState("QA Automation Engineer");

  const [analysis, setAnalysis] = useState({
    atsScore: 87,
    recommendation:
      "Tu CV está bien alineado, pero puede mejorar agregando métricas de impacto y palabras clave técnicas.",
  });

  const handleOptimizeCV = async () => {
    const result = await generateCVAnalysis(role);
    setAnalysis(result);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Generador de CV IA"
          subtitle="Crea un CV optimizado para ofertas tecnológicas"
        />

        <div className="p-6 lg:p-10">
          <section className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.22),transparent_28%)]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
                <FileText size={16} />
                AI CV Builder
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                CV inteligente
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
                Genera una vista previa de CV optimizada según rol objetivo,
                habilidades y compatibilidad laboral.
              </p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
            <aside className="space-y-6">
              <div className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                <h2 className="text-xl font-black">Configurar CV</h2>

                <label className="mt-5 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-zinc-500">
                    Rol objetivo
                  </span>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-black outline-none focus:border-[#ffd500]"
                  >
                    <option>QA Automation Engineer</option>
                    <option>Frontend Developer React</option>
                    <option>Analista BI Junior</option>
                    <option>Data Analyst Junior</option>
                  </select>
                </label>

                <button
                  onClick={handleOptimizeCV}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black"
                >
                  <Wand2 size={16} />
                  Optimizar con IA
                </button>
              </div>

              <div className="rounded-[28px] bg-black p-6 text-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
                <Sparkles className="text-[#ffd500]" />

                <h2 className="mt-4 text-xl font-black">Score ATS</h2>

                <p className="mt-2 text-5xl font-black text-[#ffd500]">
                  {analysis.atsScore}%
                </p>

                <p className="mt-3 text-sm font-medium leading-6 text-zinc-300">
                  {analysis.recommendation}
                </p>
              </div>
            </aside>

            <section className="glass-card rounded-[28px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    Vista previa del CV
                  </h2>

                  <p className="mt-1 text-sm font-bold text-zinc-500">
                    Optimizado para: {role}
                  </p>
                </div>

                <button className="flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-black text-[#ffd500]">
                  <Download size={16} />
                  Exportar PDF
                </button>
              </div>

              <div className="rounded-[24px] bg-white p-8 shadow-inner">
                <div className="border-b border-zinc-200 pb-6">
                  <h1 className="text-4xl font-black">Massimo Navarrete</h1>

                  <p className="mt-2 text-lg font-black text-[#c59b00]">
                    {role}
                  </p>

                  <p className="mt-3 text-sm font-bold text-zinc-500">
                    Santiago, Chile · massimo.navarrete@duocuc.cl · LinkedIn ·
                    Portfolio
                  </p>
                </div>

                <CVSection title="Perfil profesional">
                  Estudiante de Analista Programador con enfoque en desarrollo
                  web, análisis de datos y aseguramiento de calidad. Experiencia
                  en proyectos con React, SQL, Power BI, Postman y
                  automatización de pruebas.
                </CVSection>

                <CVSection title="Habilidades clave">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React",
                      "JavaScript",
                      "SQL",
                      "Power BI",
                      "Postman",
                      "QA",
                      "Python",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CVSection>

                <CVSection title="Proyectos destacados">
                  <ul className="space-y-3 text-sm font-medium leading-6 text-zinc-700">
                    <li>
                      <strong>SkillSync AI:</strong> plataforma de empleabilidad
                      con perfil profesional, matching laboral y análisis de
                      habilidades.
                    </li>

                    <li>
                      <strong>Dashboard BI:</strong> visualización de métricas,
                      filtros dinámicos y análisis de datos para toma de
                      decisiones.
                    </li>

                    <li>
                      <strong>QA Automation:</strong> validación funcional,
                      pruebas de APIs y documentación de evidencias.
                    </li>
                  </ul>
                </CVSection>

                <CVSection title="Recomendaciones IA">
                  <div className="space-y-3">
                    {[
                      "Agregar métricas cuantificables en proyectos.",
                      "Incluir experiencia con Selenium o Playwright.",
                      "Reforzar palabras clave del rol objetivo.",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="text-green-500" size={18} />
                        <p className="text-sm font-bold text-zinc-700">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </CVSection>
              </div>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}

function CVSection({ title, children }) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-zinc-500">
        {title}
      </h3>

      <div className="text-sm font-medium leading-7 text-zinc-700">
        {children}
      </div>
    </section>
  );
}