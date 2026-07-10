import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Bookmark,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Sparkles,
  LoaderCircle,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Map,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

import { getChileTechJobs } from "../services/jobsService";
import { saveJob } from "../services/savedJobsService";


const FILTERS = [
  "Todas",
  "QA",
  "Data",
  "Frontend",
  "Backend",
  "DevOps",
];


export default function MarketPulse() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingJobId, setSavingJobId] = useState(null);

  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todas");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getChileTechJobs();

      setJobs(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (requestError) {
      console.error(
        "Error cargando ofertas:",
        requestError
      );

      setError(
        requestError.message ||
          "No se pudieron cargar las ofertas laborales."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job) => {
    const jobId =
      job.id ||
      job.external_id ||
      job.url ||
      job.title;

    try {
      setSavingJobId(jobId);
      setSavedMessage("");
      setError("");

      await saveJob(job);

      setSavedMessage(
        `Oferta guardada correctamente: ${
          job.title || "Oferta laboral"
        }`
      );
    } catch (requestError) {
      console.error(
        "Error guardando oferta:",
        requestError
      );

      setError(
        requestError.message ||
          "No se pudo guardar la oferta."
      );
    } finally {
      setSavingJobId(null);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (!savedMessage) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setSavedMessage("");
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [savedMessage]);

  const filteredJobs = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.description,
        job.category,
        job.source,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const category = String(
        job.category || ""
      ).toLowerCase();

      const title = String(
        job.title || ""
      ).toLowerCase();

      const description = String(
        job.description || ""
      ).toLowerCase();

      const filterText = [
        category,
        title,
        description,
      ].join(" ");

      const matchesFilter =
        activeFilter === "Todas" ||
        filterText.includes(
          activeFilter.toLowerCase()
        );

      return matchesSearch && matchesFilter;
    });
  }, [jobs, searchTerm, activeFilter]);

  const averageMatch = useMemo(() => {
    if (filteredJobs.length === 0) {
      return 0;
    }

    const total = filteredJobs.reduce(
      (accumulator, job) =>
        accumulator +
        Number(job.match ?? 75),
      0
    );

    return Math.round(
      total / filteredJobs.length
    );
  }, [filteredJobs]);

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Market Pulse"
          subtitle="Oportunidades tecnológicas conectadas con tu perfil"
        />

        <div className="p-6 lg:p-10">
          {savedMessage && (
            <StatusMessage
              type="success"
              message={savedMessage}
            />
          )}

          {error && (
            <StatusMessage
              type="error"
              message={error}
            />
          )}

          <HeroSection
            jobsCount={jobs.length}
            averageMatch={averageMatch}
          />

          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onRefresh={loadJobs}
            loading={loading}
          />

          {loading ? (
            <LoadingState />
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              hasJobs={jobs.length > 0}
              onReset={() => {
                setSearchTerm("");
                setActiveFilter("Todas");
              }}
            />
          ) : (
            <>
              <section className="mt-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    Oportunidades disponibles
                  </h2>

                  <p className="mt-1 text-sm font-bold text-zinc-500">
                    {filteredJobs.length} ofertas coinciden
                    con tus filtros.
                  </p>
                </div>

                <span className="rounded-full bg-black px-4 py-2 text-xs font-black text-[#ffd500]">
                  Chile Tech
                </span>
              </section>

              <section className="mt-5 grid gap-6 xl:grid-cols-2">
                {filteredJobs.map(
                  (job, index) => {
                    const jobId =
                      job.id ||
                      job.external_id ||
                      job.url ||
                      `${job.title}-${index}`;

                    return (
                      <JobCard
                        key={jobId}
                        job={job}
                        saving={
                          savingJobId === jobId
                        }
                        onSave={() =>
                          handleSaveJob(job)
                        }
                      />
                    );
                  }
                )}
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}


function HeroSection({
  jobsCount,
  averageMatch,
}) {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.22),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,213,0,.12),transparent_30%)]" />

      <div className="relative grid gap-8 xl:grid-cols-[1fr_460px] xl:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
            <Sparkles size={16} />
            AI Job Matching
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Encuentra oportunidades que realmente encajen contigo.
          </h1>

          <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
            Explora ofertas tecnológicas disponibles en
            Chile, analiza su compatibilidad y guarda las
            oportunidades que te interesen.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <HeroStat
            icon={BriefcaseBusiness}
            value={jobsCount}
            label="Ofertas activas"
          />

          <HeroStat
            icon={Sparkles}
            value={`${averageMatch}%`}
            label="Match promedio"
          />
        </div>
      </div>
    </section>
  );
}


function HeroStat({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd500] text-black">
        <Icon size={20} />
      </div>

      <p className="mt-5 text-4xl font-black text-[#ffd500]">
        {value}
      </p>

      <p className="mt-1 text-xs font-black uppercase tracking-wide text-zinc-300">
        {label}
      </p>
    </div>
  );
}


function SearchAndFilters({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onRefresh,
  loading,
}) {
  return (
    <section className="mt-6 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Buscar por cargo, empresa, ubicación o tecnología..."
            className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-sm font-bold outline-none transition focus:border-[#ffd500] focus:bg-white"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-black text-[#ffd500] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Actualizar ofertas
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="mr-1 flex items-center gap-2 text-sm font-black text-zinc-500">
          <SlidersHorizontal size={17} />
          Filtrar:
        </div>

        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() =>
              onFilterChange(filter)
            }
            className={`rounded-full px-4 py-2 text-xs font-black transition ${
              activeFilter === filter
                ? "bg-black text-[#ffd500]"
                : "border border-zinc-200 bg-white text-zinc-600 hover:border-[#ffd500] hover:text-black"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}


function JobCard({
  job,
  saving,
  onSave,
}) {
  const match = Number(job.match ?? 75);

  const location =
    job.location ||
    "Ubicación no informada";

  const company =
    job.company ||
    "Empresa no informada";

  const category =
    job.category ||
    "Tecnología";

  const source =
    job.source ||
    "Jobs Service";

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#ffd500] hover:shadow-[0_25px_80px_rgba(0,0,0,0.12)]">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[100px] bg-[#ffd500]/10 transition-all duration-500 group-hover:bg-[#ffd500]/20" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-[#ffd500] shadow-lg">
              <BriefcaseBusiness size={27} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-zinc-400">
                Oportunidad tecnológica
              </p>

              <h2 className="mt-1 text-2xl font-black leading-tight">
                {job.title ||
                  "Oferta sin título"}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm font-black text-zinc-600">
                <Building2 size={16} />
                {company}
              </p>

              <p className="mt-2 flex items-center gap-2 text-sm font-bold text-zinc-500">
                <MapPin size={16} />
                {location}
              </p>
            </div>
          </div>

          <MatchCircle match={match} />
        </div>

        <p className="mt-6 line-clamp-3 text-sm font-medium leading-7 text-zinc-600">
          {job.description ||
            "No existe una descripción disponible para esta oferta laboral."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <JobBadge
            label={category}
            variant="dark"
          />

          <JobBadge
            label={`Match ${match}%`}
            variant="match"
          />

          <JobBadge
            label={source}
            variant="light"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {job.url ? (
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-black transition hover:border-black hover:bg-zinc-50"
            >
              <ExternalLink size={17} />
              Ver oferta
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-12 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-5 text-sm font-black text-zinc-400"
            >
              <ExternalLink size={17} />
              Sin enlace
            </button>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-black text-[#ffd500] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Bookmark size={17} />
            )}

            {saving
              ? "Guardando..."
              : "Guardar oferta"}
          </button>
        </div>
      </div>
    </article>
  );
}


function MatchCircle({ match }) {
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[7px] border-[#ffd500] bg-black text-center shadow-[0_0_25px_rgba(255,213,0,.25)]">
      <div>
        <p className="text-xl font-black text-white">
          {match}%
        </p>

        <p className="text-[9px] font-black uppercase text-[#ffd500]">
          Match
        </p>
      </div>
    </div>
  );
}


function JobBadge({
  label,
  variant,
}) {
  const styles = {
    dark: "bg-black text-[#ffd500]",
    match:
      "bg-green-100 text-green-700",
    light:
      "bg-zinc-100 text-zinc-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-black ${
        styles[variant] ||
        styles.light
      }`}
    >
      {label}
    </span>
  );
}


function StatusMessage({
  type,
  message,
}) {
  const isSuccess =
    type === "success";

  return (
    <div
      role="alert"
      className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 text-sm font-bold ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 size={20} />
      ) : (
        <AlertCircle size={20} />
      )}

      {message}
    </div>
  );
}


function LoadingState() {
  return (
    <section className="mt-6 flex min-h-[420px] items-center justify-center rounded-[28px] border border-zinc-200 bg-white">
      <div className="text-center">
        <LoaderCircle
          size={44}
          className="mx-auto animate-spin"
        />

        <h2 className="mt-5 text-xl font-black">
          Buscando oportunidades
        </h2>

        <p className="mt-2 text-sm font-bold text-zinc-500">
          Conectando con el Jobs Service...
        </p>
      </div>
    </section>
  );
}


function EmptyState({
  hasJobs,
  onReset,
}) {
  return (
    <section className="mt-6 flex min-h-[420px] items-center justify-center rounded-[28px] border border-zinc-200 bg-white p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-black text-[#ffd500]">
          <Map size={32} />
        </div>

        <h2 className="mt-6 text-2xl font-black">
          {hasJobs
            ? "No encontramos coincidencias"
            : "No hay ofertas disponibles"}
        </h2>

        <p className="mt-3 text-sm font-bold leading-7 text-zinc-500">
          {hasJobs
            ? "Prueba con otro término de búsqueda o cambia el filtro seleccionado."
            : "El Jobs Service no devolvió oportunidades laborales en este momento."}
        </p>

        {hasJobs && (
          <button
            type="button"
            onClick={onReset}
            className="mt-6 rounded-2xl bg-black px-5 py-3 text-sm font-black text-[#ffd500]"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </section>
  );
}