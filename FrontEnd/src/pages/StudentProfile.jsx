import { useState } from "react";
import {
  BriefcaseBusiness,
  Sparkles,
  MapPin,
  Mail,
  Pencil,
  FileText,
  Share2,
  BarChart3,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

import {
  studentProfile,
  studentSkills,
  studentProjects,
  opportunities,
} from "../data/mockData";

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("Resumen");

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Perfil Profesional"
          subtitle="Tu identidad profesional potenciada por IA"
        />

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-10">
          <div className="space-y-6">
            <HeroProfile />

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "Resumen" && (
              <>
                <TopGrid />
                <BottomGrid />
                <EvolutionCard />
              </>
            )}

            {activeTab === "Habilidades" && <SkillsTab />}
            {activeTab === "Proyectos" && <ProjectsTab />}
            {activeTab === "Experiencia" && <ExperienceTab />}
            {activeTab === "Educación" && <EducationTab />}
            {activeTab === "Certificaciones" && <CertificationsTab />}
            {activeTab === "CV Inteligente" && <SmartCVTab />}
          </div>

          <aside className="space-y-6">
            <OpportunitiesCard />
            <RoadmapCard />
            <QuickActions />
          </aside>
        </div>
      </section>
    </main>
  );
}

function HeroProfile() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,213,0,.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,213,0,.12),transparent_25%)]" />
      <div className="absolute -left-20 top-0 h-[300px] w-[300px] rounded-full bg-[#ffd500]/10 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-80px] h-[260px] w-[260px] rounded-full bg-[#ffd500]/10 blur-3xl" />

      <div className="relative grid gap-8 xl:grid-cols-[220px_1fr_250px_220px] xl:items-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/220?img=47"
              alt="profile"
              className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-2xl"
            />
            <span className="absolute right-2 top-8 h-5 w-5 rounded-full border-4 border-black bg-green-500" />
          </div>

          <div className="-mt-2 rounded-2xl bg-[#ffd500] px-8 py-3 text-center text-black shadow-xl">
            <p className="text-2xl font-black">
              {studentProfile.employability || 84}%
            </p>
            <p className="text-xs font-black">Empleabilidad</p>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              AI Analysis Active
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-tight">
            {studentProfile.name}
          </h1>

          <p className="mt-3 text-2xl font-black text-[#ffd500]">
            {studentProfile.career}
          </p>

          <p className="mt-3 text-lg font-semibold text-zinc-200">
            {studentProfile.institution} -{" "}
            {studentProfile.campus || "Sede San Joaquín"}
          </p>

          <div className="mt-6 space-y-3 text-sm font-semibold text-zinc-300">
            <p className="flex items-center gap-3">
              <MapPin size={17} />
              Santiago, Chile
            </p>

            <p className="flex items-center gap-3">
              <Mail size={17} />
              camila.rojas@duocuc.cl
            </p>
          </div>
        </div>

        <div className="border-y border-white/10 py-6 xl:border-x xl:border-y-0">
          <p className="mb-4 text-sm font-black">Career DNA</p>

          <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full">
            <div className="absolute inset-0 rounded-full border-[10px] border-zinc-800" />
            <div className="absolute inset-0 rounded-full border-[10px] border-[#ffd500] shadow-[0_0_40px_rgba(255,213,0,.45)]" />

            <div className="text-center">
              <p className="text-5xl font-black">
                {studentProfile.careerScore || 91}%
              </p>
              <p className="mt-1 text-xs font-semibold text-zinc-300">
                Compatibilidad
                <br />
                Laboral
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm font-bold text-green-400">
            ↑ +12% este trimestre
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-400">Rol objetivo</p>

          <h3 className="mt-2 text-2xl font-black">
            {studentProfile.targetRole}
          </h3>

          <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
            Tecnología
          </span>

          <p className="mt-5 text-sm font-medium leading-6 text-zinc-300">
            La IA detecta alta compatibilidad con este rol basado en tus
            habilidades y proyectos.
          </p>

          <button className="mt-6 flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-sm font-black transition-all duration-300 hover:border-[#ffd500] hover:text-[#ffd500]">
            <Pencil size={15} />
            Editar objetivo
          </button>
        </div>
      </div>
    </section>
  );
}

function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Resumen",
    "Habilidades",
    "Proyectos",
    "Experiencia",
    "Educación",
    "Certificaciones",
    "CV Inteligente",
  ];

  return (
    <div className="flex gap-7 overflow-x-auto border-b border-zinc-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`whitespace-nowrap pb-3 text-sm font-black transition ${
            activeTab === tab
              ? "border-b-2 border-[#ffd500] text-black"
              : "text-zinc-500 hover:text-black"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function TopGrid() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card title="Sobre mí">
        <p className="text-sm font-medium leading-7 text-zinc-600">
          Estudiante de Analista Programador con pasión por el desarrollo web,
          automatización, análisis de datos y tecnologías modernas.
        </p>
      </Card>

      <Card title="Career DNA - Análisis IA">
        <div className="grid grid-cols-3 gap-3">
          <DNAStat title="Frontend" value="94%" />
          <DNAStat title="QA" value="89%" />
          <DNAStat title="Data" value="82%" />
        </div>
      </Card>
    </div>
  );
}

function BottomGrid() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
      <SkillsTab compact />
      <ProjectsTab compact />
    </div>
  );
}

function SkillsTab({ compact = false }) {
  return (
    <Card title="Habilidades principales">
      <div className="space-y-5">
        {studentSkills.slice(0, compact ? 6 : studentSkills.length).map((skill, index) => (
          <div
            key={skill.name}
            className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-black">{skill.name}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Skill #{index + 1}
                </p>
              </div>

              <div className="rounded-full bg-black px-3 py-1 text-sm font-black text-[#ffd500]">
                {skill.level}%
              </div>
            </div>

            <div className="mb-3 h-3 overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ffd500] to-[#ffb800]"
                style={{ width: `${skill.level}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                {skill.status}
              </span>

              <span className="text-xs font-bold text-zinc-500">
                AI Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProjectsTab({ compact = false }) {
  return (
    <Card title="Proyectos destacados" action="Ver todas →">
      <div className="space-y-5">
        {studentProjects.slice(0, compact ? 3 : studentProjects.length).map((project) => (
          <div
            key={project.name}
            className="group rounded-2xl border border-zinc-100 bg-zinc-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-xl font-black text-[#ffd500]">
                AI
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black">{project.name}</p>
                    <p className="mt-1 text-sm font-bold text-zinc-500">
                      Proyecto validado por IA
                    </p>
                  </div>

                  <div className="rounded-full border-2 border-green-400 px-3 py-1 text-sm font-black text-green-600">
                    {project.score}%
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.slice(0, 5).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ExperienceTab() {
  return (
    <Card title="Experiencia profesional">
      <div className="space-y-4">
        {["Práctica Frontend", "Proyecto Freelance", "Ayudantía Técnica"].map((item) => (
          <div key={item} className="rounded-2xl bg-zinc-50 p-5">
            <p className="font-black">{item}</p>
            <p className="mt-1 text-sm font-bold text-zinc-500">
              Experiencia detectada y categorizada por IA.
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EducationTab() {
  return (
    <Card title="Educación">
      <div className="rounded-2xl bg-zinc-50 p-5">
        <p className="font-black">{studentProfile.career}</p>
        <p className="mt-1 text-sm font-bold text-zinc-500">
          {studentProfile.institution} - {studentProfile.campus || "Sede San Joaquín"}
        </p>
      </div>
    </Card>
  );
}

function CertificationsTab() {
  return (
    <Card title="Certificaciones">
      <div className="grid gap-4 md:grid-cols-2">
        {["React Fundamentals", "SQL Básico", "Testing QA", "Power BI"].map((cert) => (
          <div key={cert} className="rounded-2xl bg-zinc-50 p-5">
            <p className="font-black">{cert}</p>
            <p className="mt-1 text-sm font-bold text-green-600">
              Validada por IA
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SmartCVTab() {
  return (
    <Card title="CV Inteligente">
      <div className="rounded-3xl bg-black p-8 text-white">
        <p className="text-sm font-bold uppercase text-zinc-400">
          AI CV Builder
        </p>

        <h3 className="mt-3 text-4xl font-black">
          Tu CV tiene 87% de compatibilidad ATS
        </h3>

        <p className="mt-4 text-sm font-medium leading-7 text-zinc-300">
          La IA recomienda mejorar palabras clave técnicas, experiencia en
          proyectos y métricas de impacto.
        </p>

        <button className="mt-6 rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black">
          Generar CV optimizado
        </button>
      </div>
    </Card>
  );
}

function EvolutionCard() {
  return (
    <Card title="Evolución de tu perfil">
      <div className="relative overflow-hidden rounded-3xl bg-black p-8 text-white">
        <h3 className="text-4xl font-black">+12%</h3>
        <p className="mt-2 text-sm font-bold text-green-400">
          Tendencia excelente
        </p>
      </div>
    </Card>
  );
}

function OpportunitiesCard() {
  return (
    <Card title="Oportunidades para ti" action="Ver todas →">
      <div className="space-y-6">
        {opportunities.map((job) => (
          <div key={job.company} className="rounded-2xl bg-zinc-50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                <BriefcaseBusiness size={22} />
              </div>

              <div className="flex-1">
                <p className="font-black">{job.role}</p>
                <p className="text-sm font-bold text-zinc-500">
                  {job.company}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-green-400 text-sm font-black text-green-600">
                {job.match}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RoadmapCard() {
  return (
    <Card title="Roadmap IA recomendado">
      <div className="space-y-5">
        <RoadmapItem title="Testing Automatizado" sub="0/3 completado" />
        <RoadmapItem title="Inglés Técnico" sub="2/4 completado" active />
        <RoadmapItem title="Portfolio Avanzado" sub="1/3 completado" />
        <RoadmapItem title="Entrevistas Técnicas" sub="0/3 completado" />
      </div>
    </Card>
  );
}

function RoadmapItem({ title, sub, active }) {
  return (
    <div className="flex gap-4">
      <div
        className={`mt-1 h-5 w-5 rounded-full border-2 ${
          active ? "border-[#ffd500] bg-[#ffd500]" : "border-zinc-300"
        }`}
      />

      <div>
        <p className="text-sm font-black">{title}</p>
        <p className="text-xs font-bold text-zinc-500">{sub}</p>
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    [Sparkles, "Mejorar perfil"],
    [FileText, "Generar CV"],
    [Share2, "Compartir perfil"],
    [BarChart3, "Analytics"],
  ];

  return (
    <Card title="Acciones rápidas">
      <div className="grid grid-cols-2 gap-4">
        {actions.map(([Icon, label]) => (
          <button
            key={label}
            className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 transition-all duration-500 hover:-translate-y-2 hover:border-[#ffd500] hover:shadow-2xl"
          >
            <div className="relative flex flex-col items-center justify-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                <Icon size={24} />
              </div>

              <p className="text-sm font-black">{label}</p>
              <p className="mt-1 text-xs font-bold text-zinc-500">
                AI Powered
              </p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

function DNAStat({ title, value }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Card({ title, action, children }) {
  return (
    <section className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(0,0,0,0.10)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight">{title}</h2>

        {action && (
          <button className="text-sm font-black text-zinc-500 transition hover:text-black">
            {action}
          </button>
        )}
      </div>

      {children}
    </section>
  );
}