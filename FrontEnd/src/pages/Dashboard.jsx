import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleAlert,
  LoaderCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";
import CoachGoalCard from "../components/CoachGoalCard";
import { opportunities, studentProfile } from "../data/mockData";
import { getCoachHistory, getCoachSummary } from "../services/coachService";

export default function Dashboard() {
  const [coach, setCoach] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.allSettled([getCoachSummary(), getCoachHistory()]).then(
      ([summaryResult, historyResult]) => {
        if (!active) return;

        if (summaryResult.status === "fulfilled") {
          setCoach(summaryResult.value);
        } else {
          setError(summaryResult.reason?.message || "No se pudo cargar el coach");
        }

        if (historyResult.status === "fulfilled") {
          setHistory(historyResult.value);
        } else {
          setHistoryError(
            historyResult.reason?.message || "No se pudo cargar el historial",
          );
        }

        setLoading(false);
        setHistoryLoading(false);
      },
    );

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black mesh-bg pb-28 lg:pb-0">
      <AppSidebar />
      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Dashboard Estudiante"
          subtitle="Tu copiloto de carrera profesional"
        />

        <div className="p-6 lg:p-10">
          <CoachHero coach={coach} loading={loading} error={error} />

          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_370px]">
            <div className="space-y-6">
              <Metrics coach={coach} />
              <CoachRecommendations coach={coach} loading={loading} error={error} />
              <CareerHistoryPanel
                coach={coach}
                history={history}
                loading={historyLoading}
                error={historyError}
              />
              <OpportunitiesSection />
            </div>

            <aside className="space-y-6">
              <CoachGoalCard suggestedGoal={coach?.goal || ""} />
              <ScoreBreakdown coach={coach} />
              <ProfileCard />
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}

function CoachHero({ coach, loading, error }) {
  const score = coach?.career_score ?? studentProfile.careerScore;

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-black via-[#111111] to-[#1a1a1a] p-8 text-white shadow-[0_40px_120px_rgba(0,0,0,0.28)] lg:p-10">
      <div className="yellow-glow absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-[#ffd500]/30 blur-3xl" />
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-[#ffd500]">
            <Sparkles size={15} />
            AI Career Coach
          </div>
          <h2 className="mt-7 text-5xl font-black leading-[0.92] tracking-[-0.06em] lg:text-7xl">
            Hola, {studentProfile.name.split(" ")[0]}.
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-zinc-300">
            {loading
              ? "Estoy analizando tu perfil, tus habilidades y tu progreso profesional."
              : error
                ? "No pude actualizar tu análisis. Puedes seguir usando el dashboard mientras lo intentamos nuevamente."
                : coach?.daily_insight}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/career-roadmap" className="rounded-full bg-[#ffd500] px-6 py-4 font-black text-black">
              Ver siguiente paso
            </Link>
            <Link to="/market" className="rounded-full border border-white/10 bg-white/10 px-6 py-4 font-black transition hover:bg-[#ffd500] hover:text-black">
              Explorar oportunidades
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 text-black shadow-2xl">
          <p className="text-sm font-bold text-zinc-500">Career Score</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h3 className="text-6xl font-black tracking-tight">{score}%</h3>
            {loading && <LoaderCircle className="mb-2 animate-spin" size={26} />}
          </div>
          <div className="mt-6"><Progress value={score} /></div>
          <p className="mt-4 text-sm font-semibold leading-6 text-zinc-500">
            {coach ? `Objetivo actual: ${coach.goal}` : "Tu puntuación se actualizará con la información real de tu perfil."}
          </p>
        </div>
      </div>
    </section>
  );
}

function Metrics({ coach }) {
  const breakdown = coach?.score_breakdown;
  const score = coach?.career_score ?? studentProfile.careerScore;
  const metrics = [
    [Target, `${score}%`, "Career Score"],
    [Users, `${breakdown?.profile ?? 0}%`, "Perfil"],
    [BriefcaseBusiness, `${breakdown?.cv ?? 0}%`, "CV ATS"],
    [TrendingUp, `${breakdown?.skills ?? 0}%`, "Skills objetivo"],
  ];

  return (
    <div className="grid gap-5 md:grid-cols-4">
      {metrics.map(([Icon, value, label]) => (
        <div key={label} className="glow-card rounded-[2rem] border border-black/5 bg-white p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd500]"><Icon /></div>
          <h3 className="text-4xl font-black tracking-tight">{value}</h3>
          <p className="mt-2 font-semibold text-zinc-500">{label}</p>
        </div>
      ))}
    </div>
  );
}

function CoachRecommendations({ coach, loading, error }) {
  if (loading) {
    return <StatusCard icon={LoaderCircle} title="Preparando tus recomendaciones" spin>Estamos calculando las acciones con mayor impacto para tu objetivo profesional.</StatusCard>;
  }
  if (error) return <StatusCard icon={CircleAlert} title="No se pudo cargar el coach">{error}</StatusCard>;

  return (
    <section className="glow-card rounded-[2rem] border border-black/5 bg-white p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Plan de acción</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">Tus siguientes mejores pasos</h2>
        </div>
        <span className="rounded-full bg-black px-4 py-2 text-sm font-black text-[#ffd500]">{coach?.recommendations?.length || 0} recomendaciones</span>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {(coach?.recommendations || []).map((item) => (
          <article key={item.id} className="rounded-[1.75rem] bg-zinc-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400">Prioridad {item.priority}</span>
                <h3 className="mt-2 text-xl font-black">{item.title}</h3>
              </div>
              <div className="rounded-2xl bg-[#ffd500] px-3 py-2 text-sm font-black">+{item.impact}%</div>
            </div>
            <p className="mt-3 font-medium leading-7 text-zinc-600">{item.description}</p>
            <Link to={item.action_path} className="mt-5 inline-flex items-center gap-2 font-black">{item.action_label}<ArrowRight size={17} /></Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function CareerHistoryPanel({ coach, history, loading, error }) {
  const data = useMemo(() => {
    const records = [...history]
      .filter((item) => Number.isFinite(Number(item.career_score)))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((item) => ({
        date: new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short" }).format(new Date(item.created_at)),
        score: Number(item.career_score),
      }));

    if (records.length === 0 && coach) {
      return [{ date: "Actual", score: coach.career_score }];
    }
    return records;
  }, [coach, history]);

  const firstScore = data[0]?.score;
  const lastScore = data[data.length - 1]?.score;
  const variation = firstScore == null || lastScore == null ? 0 : lastScore - firstScore;

  return (
    <div className="glow-card rounded-[2rem] border border-black/5 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight">Evolución real del Career Score</h3>
          <p className="mt-1 font-medium text-zinc-500">Historial de evaluaciones registradas por tu AI Career Coach.</p>
        </div>
        {!loading && data.length > 0 && (
          <span className="rounded-full bg-[#ffd500] px-4 py-2 text-sm font-black">{variation >= 0 ? "+" : ""}{variation} puntos</span>
        )}
      </div>

      {loading ? (
        <div className="mt-8 flex h-[240px] items-center justify-center"><LoaderCircle className="animate-spin" /></div>
      ) : error ? (
        <div className="mt-6 rounded-2xl bg-zinc-50 p-5 font-medium text-zinc-600">{error}</div>
      ) : data.length <= 1 ? (
        <div className="mt-6 rounded-2xl bg-zinc-50 p-5 font-medium leading-7 text-zinc-600">Aún no hay suficientes mediciones para mostrar una tendencia. El gráfico crecerá cada vez que se calcule tu Career Score.</div>
      ) : (
        <div className="mt-6 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [`${value}%`, "Career Score"]} />
              <Area type="monotone" dataKey="score" stroke="#101010" fill="#ffd500" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function StatusCard({ icon: Icon, title, spin = false, children }) {
  return <div className="rounded-[2rem] border border-black/5 bg-white p-8"><Icon className={spin ? "animate-spin" : ""} /><h2 className="mt-4 text-2xl font-black">{title}</h2><p className="mt-2 font-medium leading-7 text-zinc-500">{children}</p></div>;
}

function ScoreBreakdown({ coach }) {
  const breakdown = coach?.score_breakdown || {};
  const items = [["Perfil", breakdown.profile || 0], ["Habilidades", breakdown.skills || 0], ["Roadmap", breakdown.roadmap || 0], ["CV", breakdown.cv || 0], ["Actividad", breakdown.activity || 0]];
  return <div className="glow-card rounded-[2rem] border border-black/5 bg-white p-6"><h3 className="text-2xl font-black tracking-tight">Composición del score</h3><div className="mt-6 space-y-5">{items.map(([label, value]) => <SkillLine key={label} label={label} value={value} />)}</div></div>;
}

function OpportunitiesSection() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="text-3xl font-black tracking-tight">Oportunidades recomendadas</h2><p className="mt-1 font-medium text-zinc-500">Matching laboral basado en habilidades y objetivo profesional.</p></div><Link to="/market" className="hidden rounded-full bg-black px-5 py-3 text-sm font-black text-[#ffd500] md:block">Ver todas</Link></div>
      <div className="space-y-5">{opportunities.map((job) => <OpportunityCard key={`${job.company}-${job.role}`} job={job} />)}</div>
    </div>
  );
}

function OpportunityCard({ job }) {
  return (
    <article className="glow-card rounded-[2rem] border border-black/5 bg-white p-6 transition duration-300 hover:-translate-y-1">
      <div className="flex flex-wrap justify-between gap-6"><div><div className="mb-4 flex gap-2"><Pill>{job.type}</Pill><Pill>{job.salary}</Pill></div><h3 className="text-2xl font-black tracking-tight">{job.role}</h3><p className="mt-2 flex items-center gap-2 font-medium text-zinc-500"><Building2 size={16} />{job.company}</p></div><div className="min-w-[110px] rounded-[1.5rem] bg-black px-5 py-4 text-center text-[#ffd500]"><h3 className="text-4xl font-black">{job.match}%</h3><p className="text-[11px] font-black uppercase tracking-wider">match</p></div></div>
      <div className="mt-6 flex justify-end"><Link to="/market" className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black text-[#ffd500]">Ver oportunidad<ChevronRight size={16} /></Link></div>
    </article>
  );
}

function ProfileCard() {
  return <div className="glow-card rounded-[2rem] border border-black/5 bg-white p-6"><div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ffd500] text-2xl font-black text-black">{studentProfile.initials}</div><h3 className="mt-5 text-3xl font-black">{studentProfile.name}</h3><p className="mt-1 font-medium text-zinc-500">{studentProfile.career} · {studentProfile.institution}</p><Link to="/profile" className="mt-6 block rounded-full bg-black px-5 py-3 text-center text-sm font-black text-[#ffd500]">Ver perfil completo</Link></div>;
}

function SkillLine({ label, value }) {
  return <div><div className="mb-2 flex justify-between text-sm font-bold"><span>{label}</span><span>{value}%</span></div><Progress value={value} /></div>;
}

function Pill({ children }) {
  return <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black">{children}</span>;
}

function Progress({ value }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className="h-2 overflow-hidden rounded-full bg-zinc-200"><div className="h-full bg-[#ffd500]" style={{ width: `${safeValue}%` }} /></div>;
}
