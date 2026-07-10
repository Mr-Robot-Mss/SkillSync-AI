import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  TestTube2,
  ServerCog,
  Palette,
  BarChart3,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

import { getCurrentUser } from "../services/authService";
import { analyzeProfile } from "../services/onboardingService";


const questions = [
  {
    id: "development",
    question:
      "¿Te gusta desarrollar aplicaciones o páginas web?",
    options: [
      {
        label: "Sí, me gusta mucho",
        value: 3,
      },
      {
        label: "Me interesa aprender",
        value: 2,
      },
      {
        label: "No mucho",
        value: 1,
      },
    ],
  },
  {
    id: "data",
    question:
      "¿Te interesa analizar datos, reportes o indicadores?",
    options: [
      {
        label:
          "Sí, me llama mucho la atención",
        value: 3,
      },
      {
        label:
          "Algo, pero quiero aprender más",
        value: 2,
      },
      {
        label: "No es mi prioridad",
        value: 1,
      },
    ],
  },
  {
    id: "qa",
    question:
      "¿Te gusta encontrar errores y validar que algo funcione bien?",
    options: [
      {
        label: "Sí, soy detallista",
        value: 3,
      },
      {
        label: "A veces",
        value: 2,
      },
      {
        label: "No mucho",
        value: 1,
      },
    ],
  },
  {
    id: "automation",
    question:
      "¿Te gustaría automatizar tareas repetitivas?",
    options: [
      {
        label: "Sí, totalmente",
        value: 3,
      },
      {
        label: "Me interesa",
        value: 2,
      },
      {
        label: "No mucho",
        value: 1,
      },
    ],
  },
  {
    id: "design",
    question:
      "¿Te interesa crear interfaces visuales bonitas y usables?",
    options: [
      {
        label: "Sí, me gusta lo visual",
        value: 3,
      },
      {
        label: "Un poco",
        value: 2,
      },
      {
        label: "Prefiero lógica o datos",
        value: 1,
      },
    ],
  },
  {
    id: "database",
    question:
      "¿Te gusta trabajar con bases de datos y consultas SQL?",
    options: [
      {
        label:
          "Sí, me interesa bastante",
        value: 3,
      },
      {
        label: "Estoy aprendiendo",
        value: 2,
      },
      {
        label: "No mucho",
        value: 1,
      },
    ],
  },
  {
    id: "problem",
    question:
      "¿Disfrutas investigar problemas técnicos hasta encontrar una solución?",
    options: [
      {
        label:
          "Sí, me gusta resolver problemas",
        value: 3,
      },
      {
        label: "Depende del caso",
        value: 2,
      },
      {
        label: "Me frustra rápido",
        value: 1,
      },
    ],
  },
  {
    id: "communication",
    question:
      "¿Te acomoda explicar problemas, documentar o comunicar hallazgos?",
    options: [
      {
        label: "Sí, se me da bien",
        value: 3,
      },
      {
        label: "Puedo mejorar",
        value: 2,
      },
      {
        label: "Prefiero no hacerlo",
        value: 1,
      },
    ],
  },
  {
    id: "ai",
    question:
      "¿Te interesa aplicar inteligencia artificial en proyectos?",
    options: [
      {
        label: "Sí, mucho",
        value: 3,
      },
      {
        label: "Me interesa aprender",
        value: 2,
      },
      {
        label: "No por ahora",
        value: 1,
      },
    ],
  },
  {
    id: "learning",
    question:
      "¿Qué tan cómodo te sientes aprendiendo tecnologías nuevas?",
    options: [
      {
        label: "Muy cómodo",
        value: 3,
      },
      {
        label:
          "Me cuesta, pero aprendo",
        value: 2,
      },
      {
        label: "Me cuesta bastante",
        value: 1,
      },
    ],
  },
];


const roleInfo = {
  "QA Automation": {
    icon: TestTube2,
    description:
      "Ideal si eres detallista, te gusta validar sistemas, documentar errores y automatizar pruebas.",
    skills: [
      "Postman",
      "SQL",
      "Playwright",
      "Selenium",
      "Python",
    ],
  },
  "Data Analyst": {
    icon: Database,
    description:
      "Ideal si te gusta analizar datos, crear reportes y apoyar decisiones con información.",
    skills: [
      "SQL",
      "Power BI",
      "Python",
      "ETL",
      "Excel",
    ],
  },
  "BI Analyst": {
    icon: BarChart3,
    description:
      "Ideal si te interesa convertir datos de negocio en indicadores, dashboards y decisiones.",
    skills: [
      "Power BI",
      "SQL",
      "DAX",
      "KPIs",
      "Excel",
    ],
  },
  "Software Developer": {
    icon: Code2,
    description:
      "Ideal si te gusta desarrollar aplicaciones, resolver problemas y construir soluciones digitales.",
    skills: [
      "JavaScript",
      "React",
      "APIs",
      "Git",
      "SQL",
    ],
  },
  "UX/UI Designer": {
    icon: Palette,
    description:
      "Ideal si te interesa crear experiencias visuales, interfaces usables y productos digitales.",
    skills: [
      "Figma",
      "UX/UI",
      "Diseño",
      "Prototipado",
      "Frontend",
    ],
  },
  "DevOps Engineer": {
    icon: ServerCog,
    description:
      "Ideal si te interesa infraestructura, automatización, despliegues y ambientes cloud.",
    skills: [
      "Docker",
      "Linux",
      "CI/CD",
      "Cloud",
      "Git",
    ],
  },
  "Product Manager": {
    icon: Brain,
    description:
      "Ideal si te interesa coordinar equipos, comprender usuarios y tomar decisiones de producto.",
    skills: [
      "Gestión",
      "Comunicación",
      "Roadmap",
      "KPIs",
      "Producto",
    ],
  },
};


export default function OnboardingAI() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [backendResult, setBackendResult] =
    useState(null);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");

  const answeredCount = Object.keys(
    answers
  ).length;

  const currentQuestion =
    questions[answeredCount];

  const progress = Math.round(
    (answeredCount / questions.length) *
      100
  );

  const hasAnsweredAll =
    answeredCount === questions.length;

  const selectedAnswers = useMemo(
    () =>
      questions.map((question) => ({
        ...question,
        selectedValue:
          answers[question.id],
      })),
    [answers]
  );

  const handleAnswer = (
    questionId,
    value
  ) => {
    if (loading) {
      return;
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: value,
    }));

    setError("");
  };

  const finishOnboarding = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser =
        getCurrentUser();

      if (!currentUser?.id) {
        throw new Error(
          "No se encontró el usuario autenticado. Inicia sesión nuevamente."
        );
      }

      const unansweredQuestions =
        questions.filter(
          (question) =>
            answers[question.id] ===
            undefined
        );

      if (
        unansweredQuestions.length > 0
      ) {
        throw new Error(
          "Debes responder todas las preguntas antes de continuar."
        );
      }

      const payload = {
        user_id: currentUser.id,
        answers: {
          development:
            answers.development,
          data: answers.data,
          qa: answers.qa,
          automation:
            answers.automation,
          design: answers.design,
          database: answers.database,
          problem: answers.problem,
          communication:
            answers.communication,
          ai: answers.ai,
          learning: answers.learning,
        },
      };

      const result =
        await analyzeProfile(payload);

      const storage =
        localStorage.getItem(
          "skillsync_token"
        )
          ? localStorage
          : sessionStorage;

      storage.setItem(
        "skillsync_onboarding_result",
        JSON.stringify(result)
      );

      setBackendResult(result);
      setFinished(true);
    } catch (requestError) {
      console.error(
        "Error durante el onboarding:",
        requestError
      );

      setError(
        requestError.message ||
          "No se pudo completar el diagnóstico."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetOnboarding = () => {
    setAnswers({});
    setBackendResult(null);
    setFinished(false);
    setError("");
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
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          <section className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.22),transparent_28%)]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
                <Brain size={16} />
                AI Career Diagnosis
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Descubre tu perfil profesional
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
                Responde diez preguntas y
                SkillSync analizará tus áreas
                de mayor compatibilidad
                profesional dentro del mundo
                tecnológico.
              </p>
            </div>
          </section>

          {!finished ? (
            <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
              <div className="glass-card rounded-[28px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-black text-zinc-500">
                      Pregunta{" "}
                      {Math.min(
                        answeredCount + 1,
                        questions.length
                      )}{" "}
                      de {questions.length}
                    </p>

                    <p className="text-sm font-black text-[#c59b00]">
                      {progress}%
                    </p>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-[#ffd500] transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                {currentQuestion ? (
                  <>
                    <h2 className="text-3xl font-black">
                      {
                        currentQuestion.question
                      }
                    </h2>

                    <div className="mt-8 grid gap-4">
                      {currentQuestion.options.map(
                        (option) => (
                          <button
                            key={
                              option.label
                            }
                            type="button"
                            disabled={loading}
                            onClick={() =>
                              handleAnswer(
                                currentQuestion.id,
                                option.value
                              )
                            }
                            className="rounded-3xl border border-zinc-200 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#ffd500] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <p className="text-lg font-black">
                              {option.label}
                            </p>

                            <p className="mt-1 text-sm font-bold text-zinc-500">
                              Seleccionar respuesta
                            </p>
                          </button>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-black text-[#ffd500]">
                      <Sparkles
                        size={34}
                      />
                    </div>

                    <h2 className="mt-6 text-3xl font-black">
                      Diagnóstico completado
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm font-bold leading-7 text-zinc-500">
                      Ya tenemos suficiente
                      información para analizar
                      tu compatibilidad
                      profesional.
                    </p>

                    <button
                      type="button"
                      onClick={
                        finishOnboarding
                      }
                      disabled={
                        loading ||
                        !hasAnsweredAll
                      }
                      className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#ffd500] px-6 py-4 text-sm font-black text-black transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <LoaderCircle
                            size={18}
                            className="animate-spin"
                          />
                          Analizando...
                        </>
                      ) : (
                        <>
                          Generar resultado IA
                          <ArrowRight
                            size={18}
                          />
                        </>
                      )}
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
                    Evalúa afinidad técnica,
                    datos, desarrollo, QA,
                    automatización, diseño,
                    aprendizaje y comunicación.
                  </p>
                </div>

                <div className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                  <h2 className="text-xl font-black">
                    Áreas evaluadas
                  </h2>

                  <div className="mt-5 space-y-3">
                    {[
                      "QA Automation",
                      "Data Analyst",
                      "BI Analyst",
                      "Software Developer",
                      "DevOps Engineer",
                      "UX/UI Designer",
                      "Product Manager",
                    ].map((area) => (
                      <div
                        key={area}
                        className="rounded-2xl bg-white p-4 text-sm font-black"
                      >
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                {answeredCount > 0 && (
                  <div className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                    <h2 className="text-xl font-black">
                      Progreso
                    </h2>

                    <div className="mt-4 space-y-2">
                      {selectedAnswers
                        .filter(
                          (question) =>
                            question.selectedValue !==
                            undefined
                        )
                        .map(
                          (
                            question,
                            index
                          ) => (
                            <div
                              key={
                                question.id
                              }
                              className="flex items-center gap-3 rounded-xl bg-white p-3"
                            >
                              <CheckCircle2
                                size={17}
                                className="text-green-600"
                              />

                              <span className="text-xs font-black">
                                Respuesta{" "}
                                {index + 1}
                              </span>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                )}
              </aside>
            </section>
          ) : (
            <ResultsView
              result={backendResult}
              goToProfile={goToProfile}
              resetOnboarding={
                resetOnboarding
              }
            />
          )}
        </div>
      </section>
    </main>
  );
}


function ResultsView({
  result,
  goToProfile,
  resetOnboarding,
}) {
  if (!result) {
    return (
      <section className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-6">
        <p className="font-black text-red-700">
          No se recibió un resultado
          válido del backend.
        </p>
      </section>
    );
  }

  const primary =
    roleInfo[result.primary_role] ||
    roleInfo["Software Developer"];

  const secondary =
    roleInfo[result.secondary_role] ||
    roleInfo["Data Analyst"];

  const PrimaryIcon = primary.icon;
  const SecondaryIcon = secondary.icon;

  const recommendedSkills =
    Array.isArray(
      result.recommended_skills
    ) &&
    result.recommended_skills.length > 0
      ? result.recommended_skills
      : primary.skills;

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-[32px] bg-black p-8 text-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
          <Sparkles size={16} />
          Resultado IA completado
        </div>

        <h2 className="text-4xl font-black md:text-5xl">
          Tu perfil principal es{" "}
          {result.primary_role}
        </h2>

        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-zinc-300">
          {result.recommendation ||
            primary.description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                <PrimaryIcon
                  size={28}
                />
              </div>

              <div>
                <p className="text-sm font-black uppercase text-zinc-400">
                  Perfil principal
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  {result.primary_role}
                </h3>

                <p className="mt-2 text-sm font-bold leading-6 text-zinc-500">
                  {primary.description}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-black px-5 py-4 text-center text-[#ffd500]">
              <p className="text-3xl font-black">
                {result.compatibility}%
              </p>

              <p className="text-xs font-black">
                Match
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {recommendedSkills.map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </article>

        <article className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                <SecondaryIcon
                  size={28}
                />
              </div>

              <div>
                <p className="text-sm font-black uppercase text-zinc-400">
                  Perfil secundario
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  {
                    result.secondary_role
                  }
                </h3>

                <p className="mt-2 text-sm font-bold leading-6 text-zinc-500">
                  {
                    secondary.description
                  }
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-100 px-5 py-4 text-center">
              <p className="text-3xl font-black">
                {result.secondary_compatibility ??
                  0}
                %
              </p>

              <p className="text-xs font-black text-zinc-500">
                Match
              </p>
            </div>
          </div>
        </article>
      </div>

      {Array.isArray(result.ranking) &&
        result.ranking.length > 0 && (
          <section className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <h2 className="text-2xl font-black">
              Ranking de compatibilidad
            </h2>

            <div className="mt-6 space-y-4">
              {result.ranking.map(
                (item, index) => (
                  <div
                    key={item.role}
                    className="rounded-2xl bg-white p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase text-zinc-400">
                          Posición{" "}
                          {index + 1}
                        </p>

                        <p className="mt-1 font-black">
                          {item.role}
                        </p>
                      </div>

                      <p className="text-2xl font-black">
                        {
                          item.percentage
                        }
                        %
                      </p>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-[#ffd500]"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

      <div className="flex flex-col justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={resetOnboarding}
          className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-6 py-4 text-sm font-black"
        >
          <RotateCcw size={18} />
          Repetir diagnóstico
        </button>

        <button
          type="button"
          onClick={goToProfile}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#ffd500] px-6 py-4 text-sm font-black text-black transition hover:scale-[1.03]"
        >
          Ir a mi perfil
          <CheckCircle2 size={18} />
        </button>
      </div>
    </section>
  );
}