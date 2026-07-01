import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Sparkles,
  MapPin,
  BarChart3,
  Search,
  ExternalLink,
  X,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCcw,
  TrendingUp,
  Wifi,
  Clock,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";
import { getChileTechJobs } from "../services/jobsService";
import { getSavedJobs, isJobSaved, toggleSavedJob } from "../services/savedJobsService";

const categories = ["Todos", "Frontend", "QA", "Data", "Soporte TI", "Fullstack"];
const modalities = ["Todas", "Remoto", "Híbrido", "Presencial"];
const seniorities = ["Todas", "Junior", "Semi Senior", "Senior"];
const regions = ["Todas", "Metropolitana", "Valparaíso", "Remoto"];

export default function MarketPulse() {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [modality, setModality] = useState("Todas");
  const [seniority, setSeniority] = useState("Todas");
  const [region, setRegion] = useState("Todas");
  const [selectedJob, setSelectedJob] = useState(null);

  const savedJobIds = useMemo(
    () => savedJobs.map((job) => job.job_id || job.id),
    [savedJobs]
  );

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const [jobsData, savedData] = await Promise.all([
          getChileTechJobs(),
          getSavedJobs(),
        ]);

        setJobs(jobsData);
        setSavedJobs(savedData);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const skillsText = Array.isArray(job.skills) ? job.skills.join(" ") : "";
      const text = `${job.title} ${job.company} ${skillsText}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (activeCategory === "Todos" || job.category === activeCategory) &&
        (modality === "Todas" || job.modality === modality) &&
        (seniority === "Todas" || job.seniority === seniority) &&
        (region === "Todas" || job.region === region)
      );
    });
  }, [jobs, search, activeCategory, modality, seniority, region]);

  const avgMatch =
    jobs.length > 0
      ? Math.round(jobs.reduce((sum, job) => sum + Number(job.match || 0), 0) / jobs.length)
      : 0;

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("Todos");
    setModality("Todas");
    setSeniority("Todas");
    setRegion("Todas");
  };

  const handleToggleSaved = async (job) => {
    const updated = await toggleSavedJob(job);
    setSavedJobs(updated);
  };

  const isSaved = (jobId) => {
    return savedJobIds.includes(jobId);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Oportunidades Laborales"
          subtitle="Trabajos de informática en Chile preparados para conexión con APIs reales"
        />

        <div className="p-6 lg:p-10">
          <HeroJobs total={filteredJobs.length} avgMatch={avgMatch} />

          <section className="mt-6 grid gap-6 md:grid-cols-4">
            <KpiCard icon={BriefcaseBusiness} label="Ofertas cargadas" value={jobs.length} detail="API Gateway activo" />
            <KpiCard icon={TrendingUp} label="Match promedio" value={`${avgMatch}%`} detail="Compatibilidad IA" />
            <KpiCard icon={BookmarkCheck} label="Guardadas" value={savedJobs.length} detail="Persistencia Supabase" />
            <KpiCard icon={Wifi} label="Estado API" value="Ready" detail="BFF conectado" />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <SearchAndFilters
                search={search}
                setSearch={setSearch}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                modality={modality}
                setModality={setModality}
                seniority={seniority}
                setSeniority={setSeniority}
                region={region}
                setRegion={setRegion}
                resetFilters={resetFilters}
              />

              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-zinc-500">
                  {loading ? "Cargando ofertas..." : `${filteredJobs.length} ofertas encontradas`}
                </p>

                <p className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                  <Clock size={15} />
                  {loading ? "Conectando servicio..." : "Datos desde API Gateway"}
                </p>
              </div>

              <div className="space-y-5">
                {loading ? (
                  <LoadingState />
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      saved={isSaved(job.id)}
                      onSave={() => handleToggleSaved(job)}
                      onSelect={() => setSelectedJob(job)}
                    />
                  ))
                ) : (
                  <EmptyState resetFilters={resetFilters} />
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <MarketStats jobs={jobs} />
              <SavedJobsPanel savedJobs={savedJobs} />
              <SkillDemand jobs={jobs} />
              <ApiStatus />
            </aside>
          </section>
        </div>
      </section>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          saved={isSaved(selectedJob.id)}
          onSave={() => handleToggleSaved(selectedJob)}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </main>
  );
}

function HeroJobs({ total, avgMatch }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,213,0,.12),transparent_25%)]" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
            <Sparkles size={16} />
            AI Job Matching
          </div>

          <h1 className="text-5xl font-black tracking-tight">
            Empleos tech en Chile
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
            Ofertas laborales de informática, desarrollo, QA, datos y soporte TI.
            La interfaz consume datos reales mediante API Gateway, microservicios y Supabase.
          </p>
        </div>

        <div className="rounded-3xl bg-white/10 p-6">
          <p className="text-sm font-bold text-zinc-400">Resultados actuales</p>
          <p className="mt-2 text-5xl font-black text-[#ffd500]">{total}</p>
          <p className="mt-2 text-sm font-bold text-green-400">
            Match promedio: {avgMatch}%
          </p>
        </div>
      </div>
    </section>
  );
}

function KpiCard({ icon: Icon, label, value, detail }) {
  return (
    <section className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
        <Icon size={24} />
      </div>
      <p className="text-sm font-black uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-4xl font-black">{value}</p>
      <p className="mt-2 text-sm font-bold text-zinc-500">{detail}</p>
    </section>
  );
}

function SearchAndFilters({
  search,
  setSearch,
  activeCategory,
  setActiveCategory,
  modality,
  setModality,
  seniority,
  setSeniority,
  region,
  setRegion,
  resetFilters,
}) {
  return (
    <section className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black">
            <SlidersHorizontal size={20} />
            Filtros de búsqueda
          </h2>
          <p className="mt-1 text-sm font-bold text-zinc-500">
            Busca empleos por cargo, categoría, modalidad, región y seniority.
          </p>
        </div>

        <button onClick={resetFilters} className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-black transition hover:border-[#ffd500]">
          <RefreshCcw size={16} />
          Limpiar
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por cargo, empresa o skill..."
          className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-sm font-bold outline-none transition focus:border-[#ffd500]"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveCategory(filter)}
            className={`rounded-full px-4 py-2 text-sm font-black transition ${
              activeCategory === filter
                ? "bg-black text-[#ffd500]"
                : "bg-white text-zinc-500 hover:text-black"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <SelectFilter label="Modalidad" value={modality} onChange={setModality} options={modalities} />
        <SelectFilter label="Seniority" value={seniority} onChange={setSeniority} options={seniorities} />
        <SelectFilter label="Región" value={region} onChange={setRegion} options={regions} />
      </div>
    </section>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-black outline-none transition focus:border-[#ffd500]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function JobCard({ job, saved, onSave, onSelect }) {
  const skills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <article className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(0,0,0,0.10)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
            <BriefcaseBusiness size={26} />
          </div>

          <div>
            <h2 className="text-xl font-black">{job.title}</h2>
            <p className="mt-1 text-sm font-bold text-zinc-500">{job.company}</p>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-zinc-500">
              <MapPin size={16} />
              {job.location} · {job.modality}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
              saved
                ? "border-[#ffd500] bg-[#ffd500] text-black"
                : "border-zinc-200 bg-white text-zinc-500 hover:border-[#ffd500]"
            }`}
          >
            {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>

          <div className="rounded-2xl bg-black px-5 py-4 text-center text-[#ffd500]">
            <p className="text-3xl font-black">{job.match}%</p>
            <p className="text-xs font-black">Match IA</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-5">
        <div>
          <p className="text-sm font-black">{job.salary}</p>
          <p className="text-xs font-bold text-zinc-500">
            Fuente: {job.source} · {job.seniority} · {job.region}
          </p>
        </div>

        <button onClick={onSelect} className="flex items-center gap-2 rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black transition hover:scale-[1.03]">
          Ver detalle
          <ExternalLink size={16} />
        </button>
      </div>
    </article>
  );
}

function JobDetailModal({ job, saved, onSave, onClose }) {
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-black text-zinc-400">{job.source}</p>
            <h2 className="mt-2 text-3xl font-black">{job.title}</h2>
            <p className="mt-1 text-sm font-bold text-zinc-500">
              {job.company} · {job.location}
            </p>
          </div>

          <button onClick={onClose} className="rounded-2xl bg-zinc-100 p-3 transition hover:bg-zinc-200">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <MiniInfo label="Match IA" value={`${job.match}%`} />
          <MiniInfo label="Modalidad" value={job.modality} />
          <MiniInfo label="Seniority" value={job.seniority} />
        </div>

        <div className="mt-6 rounded-3xl bg-black p-6 text-white">
          <p className="text-sm font-bold text-zinc-400">Análisis IA</p>
          <p className="mt-3 text-sm font-medium leading-7 text-zinc-300">
            Esta oferta calza con el perfil por coincidencia en skills técnicos,
            foco en informática y compatibilidad con el rol objetivo del usuario.
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-black">Descripción</h3>
          <p className="mt-2 text-sm font-medium leading-7 text-zinc-600">{job.description}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-black">Requisitos principales</h3>
          <div className="mt-4 space-y-3">
            {requirements.length > 0 ? (
              requirements.map((req) => (
                <div key={req} className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <p className="text-sm font-bold text-zinc-700">{req}</p>
                </div>
              ))
            ) : (
              <p className="text-sm font-bold text-zinc-500">
                Esta oferta no informa requisitos específicos.
              </p>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button
            onClick={onSave}
            className={`rounded-2xl px-5 py-3 text-sm font-black ${
              saved ? "bg-black text-[#ffd500]" : "border border-zinc-200"
            }`}
          >
            {saved ? "Oferta guardada" : "Guardar oferta"}
          </button>

          <button onClick={onClose} className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-black">
            Cerrar
          </button>

          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black"
            >
              Ir a la oferta
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <section className="glass-card rounded-[28px] p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      <div className="mx-auto h-16 w-16 animate-pulse rounded-2xl bg-black" />
      <h2 className="mt-5 text-2xl font-black">Cargando ofertas</h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-zinc-500">
        Consultando API Gateway y microservicio de empleos.
      </p>
    </section>
  );
}

function EmptyState({ resetFilters }) {
  return (
    <section className="glass-card rounded-[28px] p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
        <Search size={26} />
      </div>

      <h2 className="mt-5 text-2xl font-black">No encontramos ofertas</h2>

      <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-zinc-500">
        Prueba limpiando filtros o buscando por otra tecnología, cargo o empresa.
      </p>

      <button onClick={resetFilters} className="mt-6 rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black">
        Limpiar filtros
      </button>
    </section>
  );
}

function MarketStats({ jobs }) {
  const totalByCategory = (category) => jobs.filter((job) => job.category === category).length;

  return (
    <section className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      <h2 className="text-lg font-black">Resumen mercado</h2>
      <div className="mt-5 space-y-4">
        <Stat label="Frontend" value={`${totalByCategory("Frontend")} ofertas`} />
        <Stat label="QA / Testing" value={`${totalByCategory("QA")} ofertas`} />
        <Stat label="Data / BI" value={`${totalByCategory("Data")} ofertas`} />
        <Stat label="Soporte TI" value={`${totalByCategory("Soporte TI")} ofertas`} />
      </div>
    </section>
  );
}

function SavedJobsPanel({ savedJobs }) {
  return (
    <section className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      <h2 className="text-lg font-black">Ofertas guardadas</h2>
      <div className="mt-5 space-y-3">
        {savedJobs.length === 0 ? (
          <p className="text-sm font-bold text-zinc-500">Aún no tienes ofertas guardadas.</p>
        ) : (
          savedJobs.slice(0, 3).map((job) => (
            <div key={job.id} className="rounded-2xl bg-white p-4">
              <p className="text-sm font-black">{job.title}</p>
              <p className="mt-1 text-xs font-bold text-zinc-500">{job.company}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function SkillDemand({ jobs }) {
  const skills = jobs
    .flatMap((job) => (Array.isArray(job.skills) ? job.skills : []))
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

  const topSkills = Object.entries(skills).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <section className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      <h2 className="text-lg font-black">Skills más demandadas</h2>
      <div className="mt-5 space-y-4">
        {topSkills.length === 0 ? (
          <p className="text-sm font-bold text-zinc-500">Sin skills informadas.</p>
        ) : (
          topSkills.map(([skill, count]) => (
            <div key={skill}>
              <div className="mb-2 flex justify-between text-sm font-black">
                <span>{skill}</span>
                <span>{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full rounded-full bg-[#ffd500]" style={{ width: `${Math.min(count * 25, 100)}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function ApiStatus() {
  return (
    <section className="rounded-[28px] bg-black p-6 text-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd500] text-black">
        <BarChart3 size={24} />
      </div>

      <h2 className="text-xl font-black">API Gateway activo</h2>

      <p className="mt-3 text-sm font-medium leading-6 text-zinc-300">
        El frontend consume el BFF en localhost:8000, que centraliza la comunicación
        con Jobs Service y Supabase.
      </p>

      <div className="mt-5 rounded-2xl bg-white/10 p-4">
        <p className="text-xs font-bold text-zinc-400">Endpoint activo</p>
        <p className="mt-1 text-sm font-black text-[#ffd500]">
          GET /api/jobs/chile-tech
        </p>
      </div>
    </section>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4">
      <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4">
      <p className="text-sm font-bold text-zinc-500">{label}</p>
      <p className="font-black">{value}</p>
    </div>
  );
}