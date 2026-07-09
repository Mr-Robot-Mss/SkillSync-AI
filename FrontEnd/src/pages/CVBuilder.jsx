import { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

import { analyzeCV, optimizeCV } from "../services/aiService";
import { activatePremium } from "../services/subscriptionService";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

export default function CVBuilder() {
  const [role, setRole] = useState("QA Automation");
  const [cvText, setCvText] = useState(
    "Experiencia en QA, Postman, SQL, testing funcional, documentación de evidencias y pruebas de APIs."
  );
  const [jobDescription, setJobDescription] = useState(
    "Buscamos QA Automation con experiencia en Playwright, Postman, SQL, API Testing y automatización."
  );

  const [analysis, setAnalysis] = useState(null);
  const [optimized, setOptimized] = useState(null);
  const [loading, setLoading] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAnalyzeCV = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      setOptimized(null);

      const result = await analyzeCV({
        user_id: "demo-user",
        role,
        cv_text: cvText,
        job_description: jobDescription,
        skills: [],
        projects: ["SkillSync AI", "QA Automation", "Dashboard BI"],
      });

      setAnalysis(result);
    } catch (err) {
      setError(err.message || "No se pudo analizar el CV");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeCV = async () => {
    try {
      setPremiumLoading(true);
      setError("");
      setMessage("");

      const result = await optimizeCV({
        user_id: "demo-user",
        role,
        cv_text: cvText,
        job_description: jobDescription,
      });

      setOptimized(result);
    } catch (err) {
      setError(err.message || "No se pudo optimizar el CV");
    } finally {
      setPremiumLoading(false);
    }
  };

  const handleActivatePremiumAndOptimize = async () => {
    try {
      setPremiumLoading(true);
      setError("");
      setMessage("");

      await activatePremium("demo-user");

      const result = await optimizeCV({
        user_id: "demo-user",
        role,
        cv_text: cvText,
        job_description: jobDescription,
      });

      setOptimized(result);
      setMessage("Premium activado correctamente. CV optimizado desbloqueado.");
    } catch (err) {
      setError(err.message || "No se pudo activar Premium");
    } finally {
      setPremiumLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Generador de CV IA"
          subtitle="Analiza tu CV contra ofertas laborales y mejora su compatibilidad ATS"
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
                Compara tu CV con una oferta laboral, detecta palabras clave ATS
                y mejora la compatibilidad con el cargo objetivo.
              </p>
            </div>
          </section>

          {message && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <section className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
            <aside className="space-y-6">
              <div className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                <h2 className="text-xl font-black">Configurar análisis</h2>

                <label className="mt-5 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-zinc-500">
                    Rol objetivo
                  </span>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-black outline-none focus:border-[#ffd500]"
                  >
                    <option>QA Automation</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Data Analyst</option>
                    <option>BI Analyst</option>
                  </select>
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-zinc-500">
                    Texto del CV
                  </span>

                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    rows={7}
                    className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#ffd500]"
                  />
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-zinc-500">
                    Descripción de la oferta
                  </span>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={7}
                    className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#ffd500]"
                  />
                </label>

                <button
                  onClick={handleAnalyzeCV}
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black disabled:opacity-60"
                >
                  <Wand2 size={16} />
                  {loading ? "Analizando..." : "Analizar compatibilidad"}
                </button>

                <button
                  onClick={handleOptimizeCV}
                  disabled={premiumLoading}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-black text-[#ffd500] disabled:opacity-60"
                >
                  <Lock size={16} />
                  {premiumLoading ? "Optimizando..." : "Optimizar CV Premium"}
                </button>
              </div>

              <div className="rounded-[28px] bg-black p-6 text-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
                <Sparkles className="text-[#ffd500]" />

                <h2 className="mt-4 text-xl font-black">Score ATS</h2>

                <p className="mt-2 text-5xl font-black text-[#ffd500]">
                  {analysis?.ats_score ?? "--"}%
                </p>

                <p className="mt-3 text-sm font-medium leading-6 text-zinc-300">
                  {analysis?.premium_message ||
                    "Ejecuta el análisis para ver compatibilidad con la oferta laboral."}
                </p>
              </div>
            </aside>

            <section className="glass-card rounded-[28px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    Resultado del análisis
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

              {!analysis ? (
                <div className="rounded-[24px] bg-white p-8 shadow-inner">
                  <h3 className="text-2xl font-black">
                    Aún no hay análisis
                  </h3>
                  <p className="mt-3 text-sm font-bold text-zinc-500">
                    Ingresa tu CV y una descripción de oferta para calcular la
                    compatibilidad ATS.
                  </p>
                </div>
              ) : (
                <div className="rounded-[24px] bg-white p-8 shadow-inner">
                  <CVSection title="Compatibilidad con la oferta">
                    <div className="rounded-2xl bg-zinc-100 p-5">
                      <p className="text-4xl font-black">
                        {analysis.compatibility ?? analysis.ats_score}%
                      </p>
                      <p className="mt-2 text-sm font-bold text-zinc-600">
                        Score estimado según palabras clave del rol y de la
                        oferta.
                      </p>
                    </div>
                  </CVSection>

                  <CVSection title="Keywords encontradas">
                    <KeywordList
                      items={analysis.matched_keywords}
                      type="success"
                    />
                  </CVSection>

                  <CVSection title="Keywords faltantes">
                    <KeywordList
                      items={analysis.missing_keywords}
                      type="warning"
                    />
                  </CVSection>

                  <CVSection title="Recomendaciones IA">
                    <div className="space-y-3">
                      {analysis.recommendations?.map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <CheckCircle2
                            className="text-green-500"
                            size={18}
                          />
                          <p className="text-sm font-bold text-zinc-700">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CVSection>

                  {optimized?.blocked && (
                    <CVSection title="Premium requerido">
                      <div className="rounded-2xl border border-[#ffd500] bg-[#fff8cc] p-5">
                        <div className="flex items-center gap-2 font-black">
                          <Lock size={18} />
                          Premium $2.500
                        </div>
                        <p className="mt-2 text-sm font-bold text-zinc-700">
                          {optimized.message}
                        </p>

                        <button
                          onClick={handleActivatePremiumAndOptimize}
                          disabled={premiumLoading}
                          className="mt-4 rounded-full bg-black px-5 py-3 text-sm font-black text-[#ffd500] disabled:opacity-60"
                        >
                          {premiumLoading
                            ? "Activando..."
                            : "Activar Premium y optimizar"}
                        </button>
                      </div>
                    </CVSection>
                  )}

                  {optimized && !optimized.blocked && (
                    <CVSection title="CV optimizado Premium">
                      <p className="text-sm font-bold text-zinc-700">
                        {optimized.optimized_profile}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {optimized.optimized_skills?.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-black px-3 py-1 text-xs font-black text-[#ffd500]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 space-y-3">
                        {optimized.ats_tips?.map((tip) => (
                          <div key={tip} className="flex items-center gap-3">
                            <AlertCircle
                              className="text-[#c59b00]"
                              size={18}
                            />
                            <p className="text-sm font-bold text-zinc-700">
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CVSection>
                  )}
                </div>
              )}
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}

function KeywordList({ items = [], type }) {
  if (!items.length) {
    return (
      <p className="text-sm font-bold text-zinc-500">
        No hay elementos para mostrar.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded-full px-3 py-1 text-xs font-black ${
            type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
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