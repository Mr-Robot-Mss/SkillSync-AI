import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  TestTube2,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";
import { analyzeProfile } from "../services/onboardingService";

const questions = [
  {
    id: "development",
    question: "¿Te gusta desarrollar aplicaciones o páginas web?",
    options: [
      { label: "Sí, me gusta mucho", value: 3 },
      { label: "Me interesa aprender", value: 2 },
      { label: "No mucho", value: 1 },
    ],
  },
  {
    id: "data",
    question: "¿Te interesa analizar datos, reportes o indicadores?",
    options: [
      { label: "Sí, me llama mucho la atención", value: 3 },
      { label: "Algo, pero quiero aprender más", value: 2 },
      { label: "No es mi prioridad", value: 1 },
    ],
  },
  {
    id: "qa",
    question: "¿Te gusta encontrar errores y validar que algo funcione bien?",
    options: [
      { label: "Sí, soy detallista", value: 3 },
      { label: "A veces", value: 2 },
      { label: "No mucho", value: 1 },
    ],
  },
  {
    id: "automation",
    question: "¿Te gustaría automatizar tareas repetitivas?",
    options: [
      { label: "Sí, totalmente", value: 3 },
      { label: "Me interesa", value: 2 },
      { label: "No mucho", value: 1 },
    ],
  },
  {
    id: "design",
    question: "¿Te interesa crear interfaces visuales bonitas y usables?",
    options: [
      { label: "Sí, me gusta lo visual", value: 3 },
      { label: "Un poco", value: 2 },
      { label: "Prefiero lógica/datos", value: 1 },
    ],
  },
  {
    id: "database",
    question: "¿Te gusta trabajar con bases de datos y consultas SQL?",
    options: [
      { label: "Sí, me interesa bastante", value: 3 },
      { label: "Estoy aprendiendo", value: 2 },
      { label: "No mucho", value: 1 },
    ],
  },
  {
    id: "problem",
    question: "¿Disfrutas investigar problemas técnicos hasta encontrar solución?",
    options: [
      { label: "Sí, me gusta resolver problemas", value: 3 },
      { label: "Depende del caso", value: 2 },
      { label: "Me frustra rápido", value: 1 },
    ],
  },
  {
    id: "communication",
    question: "¿Te acomoda explicar problemas, documentar o comunicar hallazgos?",
    options: [
      { label: "Sí, se me da bien", value: 3 },
      { label: "Puedo mejorar", value: 2 },
      { label: "Prefiero no hacerlo", value: 1 },
    ],
  },
  {
    id: "ai",
    question: "¿Te interesa aplicar inteligencia artificial en proyectos?",
    options: [
      { label: "Sí, mucho", value: 3 },
      { label: "Me interesa aprender", value: 2 },
      { label: "No por ahora", value: 1 },
    ],
  },
  {
    id: "learning",
    question: "¿Qué tan cómodo te sientes aprendiendo tecnologías nuevas?",
    options: [
      { label: "Muy cómodo", value: 3 },
      { label: "Me cuesta, pero aprendo", value: 2 },
      { label: "Me cuesta bastante", value: 1 },
    ],
  },
];

const roleInfo = {
  "QA Automation": {
    icon: TestTube2,
    desc: "Ideal si eres detallista, te gusta validar sistemas, documentar errores y automatizar pruebas.",
    skills: ["Postman", "SQL", "Selenium", "Playwright", "Python"],
  },
  "Data Analyst": {
    icon: Database,
    desc: "Ideal si te gusta analizar datos, crear reportes y apoyar decisiones con información.",
    skills: ["SQL", "Power BI", "Python", "ETL", "Excel"],
  },
  "Software Developer": {
    icon: Code2,
    desc: "Ideal si te gusta desarrollar aplicaciones, resolver problemas y construir soluciones digitales.",
    skills: ["JavaScript", "React", "APIs", "Git", "SQL"],
  },
  "UX/UI Designer": {
    icon: Code2,
    desc: "Ideal si te interesa crear experiencias visuales, interfaces usables y productos digitales.",
    skills: ["UX/UI", "Figma", "Diseño", "Prototipado", "Frontend"],
  },
  "DevOps Engineer": {
    icon: Code2,
    desc: "Ideal si te interesa infraestructura, automatización, despliegues y ambientes cloud.",
    skills: ["Docker", "AWS", "CI/CD", "Linux", "Git"],
  },
  "Product Manager": {
    icon: Brain,
    desc: "Ideal si te interesa coordinar equipos, entender usuarios y tomar decisiones de producto.",
    skills: ["Gestión", "Comunicación", "Roadmap", "KPIs", "Producto"],
  },
};

export default function OnboardingAI() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [backendResult, setBackendResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentIndex = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];
  const progress = Math.round((currentIndex / questions.length) * 100);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const finishOnboarding = async () => {
    try {
      setLoading(true);

      const payload = {
        programming: answers.development || 1,
        data: answers.data || 1,
        leadership: answers.communication || 1,
        design: answers.design || 1,
        infrastructure: Math.max(
          answers.database || 1,
          answers.automation || 1
        ),
      };

      const result = await analyzeProfile(payload);

      localStorage.setItem(
        "skillsync_onboarding_result",
        JSON.stringify(result)
      );

      setBackendResult(result);
      setFinished(true);
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con la IA del backend.");
    } finally {
      setLoading(false);
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Onboarding IA"
          subtitle="Diagnóstico profesional inteligente"
        />

        <div className="p-6 lg:p-10">
          <section className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.22),transparent_28%)]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
                <Brain size={16} />
                AI Career Diagnosis
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                Descubre tu perfil profesional
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
                Responde 10 preguntas y la IA estimará tus áreas de mayor
                compatibilidad laboral dentro del mundo tecnológico.
              </p>
            </div>
          </section>

          {!finished ? (
            <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
              <div className="glass-card rounded-[28px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-black text-zinc-500">
                      Pregunta {Math.min(currentIndex + 1, questions.length)} de{" "}
                      {questions.length}
                    </p>

                    <p className="text-sm font-black text-[#c59b00]">
                      {progress}%
                    </p>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-[#ffd500]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {currentQuestion ? (
                  <>
                    <h2 className="text-3xl font-black">
                      {currentQuestion.question}
                    </h2>

                    <div className="mt-8 grid gap-4">
                      {currentQuestion.options.map((option) => (
                        <button
                          key={option.label}
                          onClick={() =>
                            handleAnswer(currentQuestion.id, option.value)
                          }
                          className="rounded-3xl border border-zinc-200 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#ffd500] hover:shadow-xl"
                        >
                          <p className="text-lg font-black">{option.label}</p>
                          <p className="mt-1 text-sm font-bold text-zinc-500">
                            Seleccionar respuesta
                          </p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-black text-[#ffd500]">
                      <Sparkles size={34} />
                    </div>

                    <h2 className="mt-6 text-3xl font-black">
                      Diagnóstico completado
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm font-bold leading-7 text-zinc-500">
                      Ya tenemos suficiente información para consultar el motor
                      IA del backend.
                    </p>

                    <button
                      onClick={finishOnboarding}
                      disabled={loading}
                      className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#ffd500] px-6 py-4 text-sm font-black text-black transition hover:scale-[1.03] disabled:opacity-60"
                    >
                      {loading ? "Analizando..." : "Generar resultado IA"}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>

              <aside className="space-y-6">
                <div className="rounded-[28px] bg-black p-6 text-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
                  <Sparkles className="text-[#ffd500]" />

                  <h2 className="mt-4 text-2xl font-black">
                    ¿Qué analiza la IA?
                  </h2>

                  <p className="mt-3 text-sm font-medium leading-7 text-zinc-300">
                    La IA evalúa intereses, afinidad técnica, orientación a
                    datos, desarrollo, QA, automatización, aprendizaje y
                    comunicación.
                  </p>
                </div>

                <div className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                  <h2 className="text-xl font-black">Áreas evaluadas</h2>

                  <div className="mt-5 space-y-3">
                    {["QA Automation", "Data Analyst", "Developer", "DevOps"].map(
                      (area) => (
                        <div
                          key={area}
                          className="rounded-2xl bg-white p-4 text-sm font-black"
                        >
                          {area}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </aside>
            </section>
          ) : (
            <ResultsView result={backendResult} goToProfile={goToProfile} />
          )}
        </div>
      </section>
    </main>
  );
}

function ResultsView({ result, goToProfile }) {
  const primary = roleInfo[result.primary_role] || roleInfo["Software Developer"];
  const secondary =
    roleInfo[result.secondary_role] || roleInfo["Data Analyst"];

  const PrimaryIcon = primary.icon;
  const SecondaryIcon = secondary.icon;

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-[32px] bg-black p-8 text-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
          <Sparkles size={16} />
          Resultado IA desde FastAPI
        </div>

        <h2 className="text-5xl font-black">
          Tu perfil principal es {result.primary_role}
        </h2>

        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-zinc-300">
          {primary.desc}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                <PrimaryIcon size={28} />
              </div>

              <div>
                <h3 className="text-2xl font-black">{result.primary_role}</h3>
                <p className="mt-2 text-sm font-bold leading-6 text-zinc-500">
                  {primary.desc}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-black px-4 py-3 text-center text-[#ffd500]">
              <p className="text-2xl font-black">{result.compatibility}%</p>
              <p className="text-xs font-black">Match</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {primary.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </article>

        <article className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
              <SecondaryIcon size={28} />
            </div>

            <div>
              <p className="text-sm font-black text-zinc-400">
                Perfil secundario
              </p>
              <h3 className="text-2xl font-black">{result.secondary_role}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-zinc-500">
                {secondary.desc}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="flex justify-end">
        <button
          onClick={goToProfile}
          className="flex items-center gap-2 rounded-2xl bg-[#ffd500] px-6 py-4 text-sm font-black text-black transition hover:scale-[1.03]"
        >
          Ir a mi perfil
          <CheckCircle2 size={18} />
        </button>
      </div>
    </section>
  );
}