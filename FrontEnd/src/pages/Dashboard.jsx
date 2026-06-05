import {
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

import { opportunities, studentProfile } from "../data/mockData";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black mesh-bg pb-28 lg:pb-0">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Dashboard Estudiante"
          subtitle="Career DNA, oportunidades y progreso profesional"
        />

        <div className="p-6 lg:p-10">
          <Hero />

          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_370px]">
            <div className="space-y-6">
              <Metrics />
              <AnalyticsPanel />
              <OpportunitiesSection />
            </div>

            <aside className="space-y-6">
              <ProfileCard />
              <SkillsCard />
              <RoadmapCard />
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-black via-[#111111] to-[#1a1a1a] p-8 text-white shadow-[0_40px_120px_rgba(0,0,0,0.28)] lg:p-10">
      <div className="yellow-glow absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-[#ffd500]/30 blur-3xl" />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-[#ffd500]">
            <Sparkles size={15} />
            IA Predictiva Activa
          </div>

          <h2 className="mt-7 text-5xl font-black leading-[0.92] tracking-[-0.06em] lg:text-7xl">
            Bienvenida, {studentProfile.name.split(" ")[0]}.
          </h2>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-zinc-300">
            Tu perfil aumentó un 12% en compatibilidad laboral esta semana.
            Detectamos nuevas oportunidades alineadas a React, SQL y Testing.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/profile"
              className="rounded-full bg-[#ffd500] px-6 py-4 font-black text-black"
            >
              Ver perfil completo
            </Link>

            <Link
              to="/market"
              className="rounded-full border border-white/10 bg-white/10 px-6 py-4 font-black transition hover:bg-[#ffd500] hover:text-black"
            >
              Ver Market Pulse
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 text-black shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-zinc-500">Career DNA</p>
              <h3 className="mt-1 text-3xl font-black">
                {studentProfile.careerScore}%
              </h3>
            </div>

            <div className="rounded-2xl bg-[#ffd500] px-4 py-3 text-center">
              <p className="text-2xl font-black">
                {studentProfile.employability}%
              </p>
              <p className="text-[10px] font-black uppercase">
                empleabilidad
              </p>
            </div>
          </div>

          <div className="mt-6">
            <SkillLine label="Frontend Development" value={92} />
            <SkillLine label="SQL & Data" value={81} />
            <SkillLine label="Testing" value={64} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <div className="grid gap-5 md:grid-cols-4">
      {[
        [Users, "12", "Postulaciones"],
        [Target, `${studentProfile.careerScore}%`, "Career Score"],
        [BriefcaseBusiness, "8", "Entrevistas"],
        [TrendingUp, "+12%", "Crecimiento"],
      ].map(([Icon, value, label]) => (
        <div
          key={label}
          className="glow-card rounded-[2rem] border border-black/5 bg-white p-6"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd500]">
            <Icon />
          </div>

          <h3 className="text-5xl font-black tracking-tight">{value}</h3>
          <p className="mt-2 font-semibold text-zinc-500">{label}</p>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPanel() {
  const data = [
    { month: "Ene", match: 62 },
    { month: "Feb", match: 68 },
    { month: "Mar", match: 71 },
    { month: "Abr", match: 77 },
    { month: "May", match: 84 },
    { month: "Jun", match: 91 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="glow-card rounded-[2rem] border border-black/5 bg-white p-6">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              Evolución de compatibilidad
            </h3>
            <p className="mt-1 font-medium text-zinc-500">
              Progreso del perfil profesional durante los últimos meses.
            </p>
          </div>

          <span className="rounded-full bg-[#ffd500] px-4 py-2 text-sm font-black">
            +29%
          </span>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="match"
                stroke="#101010"
                fill="#ffd500"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[2rem] bg-black p-6 text-white shadow-[0_35px_120px_rgba(0,0,0,0.22)]">
        <h3 className="text-2xl font-black text-[#ffd500]">
          Actividad reciente
        </h3>

        <div className="mt-6 space-y-4">
          {[
            ["IA actualizó tu Career DNA", "Hace 4 min"],
            ["Nueva empresa compatible detectada", "Hace 18 min"],
            ["Tu CV mejoró su score ATS", "Hoy"],
            ["Nueva brecha: Testing automatizado", "Ayer"],
          ].map(([title, time]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/10 p-4"
            >
              <p className="font-black">{title}</p>
              <p className="mt-1 text-sm text-zinc-400">{time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OpportunitiesSection() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            Oportunidades recomendadas
          </h2>
          <p className="mt-1 font-medium text-zinc-500">
            Matching laboral basado en IA y habilidades reales.
          </p>
        </div>

        <button className="hidden rounded-full bg-black px-5 py-3 text-sm font-black text-[#ffd500] md:block">
          Ver todas
        </button>
      </div>

      <div className="space-y-5">
        {opportunities.map((job) => (
          <OpportunityCard key={job.company} job={job} />
        ))}
      </div>
    </div>
  );
}

function OpportunityCard({ job }) {
  return (
    <article className="glow-card rounded-[2rem] border border-black/5 bg-white p-6 transition duration-300 hover:-translate-y-2 hover:scale-[1.01]">
      <div className="flex flex-wrap justify-between gap-6">
        <div>
          <div className="mb-4 flex gap-2">
            <Pill>{job.type}</Pill>
            <Pill>{job.salary}</Pill>
          </div>

          <h3 className="text-2xl font-black tracking-tight">{job.role}</h3>

          <p className="mt-2 flex items-center gap-2 font-medium text-zinc-500">
            <Building2 size={16} />
            {job.company}
          </p>
        </div>

        <div className="min-w-[110px] rounded-[1.5rem] bg-black px-5 py-4 text-center text-[#ffd500]">
          <h3 className="text-4xl font-black">{job.match}%</h3>
          <p className="text-[11px] font-black uppercase tracking-wider">
            match
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-l-4 border-[#ffd500] bg-zinc-50 p-5">
        <p className="font-medium leading-7 text-zinc-700">
          La IA detectó alta compatibilidad entre tu stack actual y esta
          oportunidad laboral.
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black text-[#ffd500]">
          Ver oportunidad
          <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}

function ProfileCard() {
  return (
    <div className="rounded-[2rem] bg-black p-6 text-white shadow-[0_35px_120px_rgba(0,0,0,0.25)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ffd500] text-2xl font-black text-black">
        {studentProfile.initials}
      </div>

      <h3 className="mt-5 text-3xl font-black">{studentProfile.name}</h3>

      <p className="mt-1 font-medium text-zinc-400">
        {studentProfile.career} · {studentProfile.institution}
      </p>

      <div className="mt-6">
        <Link
          to="/profile"
          className="block rounded-full bg-[#ffd500] px-5 py-3 text-center text-sm font-black text-black"
        >
          Ver perfil completo
        </Link>
      </div>
    </div>
  );
}

function SkillsCard() {
  return (
    <div className="glow-card rounded-[2rem] border border-black/5 bg-white p-6">
      <h3 className="text-2xl font-black tracking-tight">Skills IA</h3>

      <div className="mt-6 flex flex-wrap gap-3">
        {["React", "SQL", "JavaScript", "Tailwind", "Testing", "Python", "Power BI"].map(
          (skill) => (
            <div
              key={skill}
              className="rounded-full bg-zinc-100 px-4 py-3 text-sm font-black"
            >
              {skill}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function RoadmapCard() {
  return (
    <div className="glow-card rounded-[2rem] border border-black/5 bg-white p-6">
      <h3 className="text-2xl font-black tracking-tight">Roadmap IA</h3>

      <div className="mt-6 space-y-4">
        {[
          "Completar Testing automatizado",
          "Publicar portfolio React",
          "Practicar entrevistas técnicas",
          "Subir nivel de inglés",
        ].map((item, index) => (
          <div key={item} className="flex gap-4 rounded-2xl bg-zinc-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffd500] font-black">
              {index + 1}
            </div>

            <p className="font-medium leading-7 text-zinc-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillLine({ label, value }) {
  return (
    <div className="mt-5 first:mt-0">
      <div className="mb-2 flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black">
      {children}
    </span>
  );
}

function Progress({ value }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
      <div className="h-full bg-[#ffd500]" style={{ width: `${value}%` }} />
    </div>
  );
}