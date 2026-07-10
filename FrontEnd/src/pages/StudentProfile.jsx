import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Sparkles,
  MapPin,
  Mail,
  Pencil,
  FileText,
  Share2,
  BarChart3,
  Camera,
  Save,
  X,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

import { getCurrentUser } from "../services/authService";
import {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
} from "../services/profileService";

const EMPTY_PROFILE = {
  name: "",
  email: "",
  city: "",
  career: "",
  about_me: "",
  avatar_url: "",
  linkedin: "",
  github: "",
  target_role: "",
  skills: [],
  projects: [],
};

export default function StudentProfile() {
  const authenticatedUser = getCurrentUser();

  const [activeTab, setActiveTab] = useState("Resumen");
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [form, setForm] = useState(EMPTY_PROFILE);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProfile();

      const normalizedProfile = {
        ...EMPTY_PROFILE,
        ...data,
        name:
          data?.name ||
          authenticatedUser?.name ||
          "Estudiante Duoc UC",
        email:
          data?.email ||
          authenticatedUser?.email ||
          "",
        skills: Array.isArray(data?.skills)
          ? data.skills
          : [],
        projects: Array.isArray(data?.projects)
          ? data.projects
          : [],
      };

      setProfile(normalizedProfile);
      setForm(normalizedProfile);
    } catch (err) {
      setError(
        err.message || "No se pudo cargar el perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: form.name.trim(),
        email:
          authenticatedUser?.email ||
          form.email.trim(),
        city: form.city.trim(),
        career: form.career.trim(),
        about_me: form.about_me.trim(),
        linkedin: form.linkedin.trim(),
        github: form.github.trim(),
        target_role: form.target_role.trim(),
      };

      const result = await updateMyProfile(payload);

      const updatedProfile = {
        ...profile,
        ...(result.profile || payload),
      };

      setProfile(updatedProfile);
      setForm(updatedProfile);
      setEditing(false);
      setMessage("Perfil actualizado correctamente.");
    } catch (err) {
      setError(
        err.message || "No se pudo guardar el perfil"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(profile);
    setEditing(false);
    setError("");
    setMessage("");
  };

  const handleAvatarSelection = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "La imagen debe ser JPG, PNG o WEBP."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "La imagen no puede superar 5 MB."
      );
      event.target.value = "";
      return;
    }

    try {
      setUploadingAvatar(true);
      setError("");
      setMessage("");

      const result = await uploadMyAvatar(file);

      const avatarUrl =
        result.avatar_url ||
        result.profile?.avatar_url ||
        "";

      setProfile((current) => ({
        ...current,
        avatar_url: avatarUrl,
      }));

      setForm((current) => ({
        ...current,
        avatar_url: avatarUrl,
      }));

      setMessage("Imagen de perfil actualizada.");
    } catch (err) {
      setError(
        err.message || "No se pudo subir la imagen"
      );
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f3] text-black">
        <AppSidebar />

        <section className="lg:ml-[290px]">
          <AppTopbar
            title="Perfil Profesional"
            subtitle="Tu identidad profesional potenciada por IA"
          />

          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                size={42}
                className="mx-auto animate-spin"
              />
              <p className="mt-4 font-black">
                Cargando perfil...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="Perfil Profesional"
          subtitle="Tu identidad profesional potenciada por IA"
        />

        <div className="p-6 lg:p-10">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
              {message}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <HeroProfile
                profile={profile}
                uploadingAvatar={uploadingAvatar}
                fileInputRef={fileInputRef}
                onAvatarSelection={
                  handleAvatarSelection
                }
                onEdit={() => setEditing(true)}
              />

              {editing && (
                <EditProfileCard
                  form={form}
                  saving={saving}
                  onChange={handleChange}
                  onSave={handleSaveProfile}
                  onCancel={handleCancelEdit}
                />
              )}

              <Tabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {activeTab === "Resumen" && (
                <>
                  <TopGrid
                    profile={profile}
                    onEdit={() =>
                      setEditing(true)
                    }
                  />

                  <BottomGrid
                    skills={profile.skills}
                    projects={profile.projects}
                  />

                  <EvolutionCard />
                </>
              )}

              {activeTab === "Habilidades" && (
                <SkillsTab
                  skills={profile.skills}
                />
              )}

              {activeTab === "Proyectos" && (
                <ProjectsTab
                  projects={profile.projects}
                />
              )}

              {activeTab === "Experiencia" && (
                <ExperienceTab />
              )}

              {activeTab === "Educación" && (
                <EducationTab profile={profile} />
              )}

              {activeTab === "Certificaciones" && (
                <CertificationsTab />
              )}

              {activeTab === "CV Inteligente" && (
                <SmartCVTab />
              )}
            </div>

            <aside className="space-y-6">
              <OpportunitiesCard />
              <RoadmapCard />
              <QuickActions />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroProfile({
  profile,
  uploadingAvatar,
  fileInputRef,
  onAvatarSelection,
  onEdit,
}) {
  const initials = profile.name
    ?.split(" ")
    .filter(Boolean)
    .map((item) => item[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "DU";

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,213,0,.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,213,0,.12),transparent_25%)]" />

      <div className="relative grid gap-8 xl:grid-cols-[220px_1fr_250px_220px] xl:items-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={`Perfil de ${profile.name}`}
                className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-2xl"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-white bg-[#ffd500] text-4xl font-black text-black shadow-2xl">
                {initials}
              </div>
            )}

            <button
              type="button"
              disabled={uploadingAvatar}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="absolute bottom-1 right-1 flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-[#ffd500] text-black shadow-xl transition hover:scale-110 disabled:opacity-60"
              title="Cambiar imagen"
            >
              {uploadingAvatar ? (
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <Camera size={20} />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onAvatarSelection}
              className="hidden"
            />
          </div>

          <div className="-mt-2 rounded-2xl bg-[#ffd500] px-8 py-3 text-center text-black shadow-xl">
            <p className="text-2xl font-black">
              84%
            </p>
            <p className="text-xs font-black">
              Empleabilidad
            </p>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Perfil sincronizado
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-tight">
            {profile.name || "Estudiante Duoc UC"}
          </h1>

          <p className="mt-3 text-2xl font-black text-[#ffd500]">
            {profile.career ||
              "Carrera no configurada"}
          </p>

          <p className="mt-3 text-lg font-semibold text-zinc-200">
            Duoc UC
          </p>

          <div className="mt-6 space-y-3 text-sm font-semibold text-zinc-300">
            <p className="flex items-center gap-3">
              <MapPin size={17} />
              {profile.city ||
                "Ubicación no configurada"}
            </p>

            <p className="flex items-center gap-3">
              <Mail size={17} />
              {profile.email}
            </p>
          </div>
        </div>

        <div className="border-y border-white/10 py-6 xl:border-x xl:border-y-0">
          <p className="mb-4 text-center text-sm font-black">
            Career DNA
          </p>

          <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full">
            <div className="absolute inset-0 rounded-full border-[10px] border-zinc-800" />
            <div className="absolute inset-0 rounded-full border-[10px] border-[#ffd500] shadow-[0_0_40px_rgba(255,213,0,.45)]" />

            <div className="text-center">
              <p className="text-5xl font-black">
                91%
              </p>
              <p className="mt-1 text-xs font-semibold text-zinc-300">
                Compatibilidad
                <br />
                laboral
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-400">
            Rol objetivo
          </p>

          <h3 className="mt-2 text-2xl font-black">
            {profile.target_role ||
              "Sin definir"}
          </h3>

          <p className="mt-5 text-sm font-medium leading-6 text-zinc-300">
            Configura tu objetivo profesional para que
            SkillSync adapte tu roadmap y recomendaciones.
          </p>

          <button
            type="button"
            onClick={onEdit}
            className="mt-6 flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-sm font-black transition hover:border-[#ffd500] hover:text-[#ffd500]"
          >
            <Pencil size={15} />
            Editar perfil
          </button>
        </div>
      </div>
    </section>
  );
}

function EditProfileCard({
  form,
  saving,
  onChange,
  onSave,
  onCancel,
}) {
  return (
    <section className="glass-card rounded-[28px] p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">
            Editar perfil
          </h2>
          <p className="mt-1 text-sm font-bold text-zinc-500">
            Los cambios quedarán guardados en tu cuenta.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ProfileInput
          label="Nombre"
          name="name"
          value={form.name}
          onChange={onChange}
        />

        <ProfileInput
          label="Correo institucional"
          name="email"
          value={form.email}
          onChange={onChange}
          disabled
        />

        <ProfileInput
          label="Ciudad"
          name="city"
          value={form.city}
          onChange={onChange}
        />

        <ProfileInput
          label="Carrera"
          name="career"
          value={form.career}
          onChange={onChange}
        />

        <ProfileInput
          label="Rol objetivo"
          name="target_role"
          value={form.target_role}
          onChange={onChange}
        />

        <ProfileInput
          label="LinkedIn"
          name="linkedin"
          value={form.linkedin}
          onChange={onChange}
        />

        <ProfileInput
          label="GitHub"
          name="github"
          value={form.github}
          onChange={onChange}
        />

        <label className="md:col-span-2">
          <span className="mb-2 block text-xs font-black uppercase text-zinc-500">
            Sobre mí
          </span>

          <textarea
            name="about_me"
            value={form.about_me}
            onChange={onChange}
            rows={6}
            maxLength={2000}
            placeholder="Cuéntanos sobre tu perfil, experiencia, intereses y objetivos..."
            className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#ffd500]"
          />

          <p className="mt-1 text-right text-xs font-bold text-zinc-400">
            {form.about_me.length}/2000
          </p>
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-black"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-black text-[#ffd500] disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
          ) : (
            <Save size={17} />
          )}
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </section>
  );
}

function ProfileInput({
  label,
  name,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-black uppercase text-zinc-500">
        {label}
      </span>

      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#ffd500] disabled:bg-zinc-100 disabled:text-zinc-500"
      />
    </label>
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
          type="button"
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

function TopGrid({ profile, onEdit }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card title="Sobre mí">
        <p className="text-sm font-medium leading-7 text-zinc-600">
          {profile.about_me ||
            "Aún no has agregado una descripción personal."}
        </p>

        <button
          type="button"
          onClick={onEdit}
          className="mt-4 flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-black text-[#ffd500]"
        >
          <Pencil size={14} />
          Editar Sobre mí
        </button>
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

function BottomGrid({ skills, projects }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
      <SkillsTab
        skills={skills}
        compact
      />

      <ProjectsTab
        projects={projects}
        compact
      />
    </div>
  );
}

function SkillsTab({
  skills = [],
  compact = false,
}) {
  const visibleSkills = compact
    ? skills.slice(0, 6)
    : skills;

  return (
    <Card title="Habilidades principales">
      {visibleSkills.length === 0 ? (
        <EmptyState text="Aún no tienes habilidades registradas." />
      ) : (
        <div className="space-y-5">
          {visibleSkills.map((skill, index) => (
            <div
              key={skill.id || `${skill.name}-${index}`}
              className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-black">
                    {skill.name}
                  </p>
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    Skill #{index + 1}
                  </p>
                </div>

                <div className="rounded-full bg-black px-3 py-1 text-sm font-black text-[#ffd500]">
                  {skill.level ?? 50}%
                </div>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ffd500] to-[#ffb800]"
                  style={{
                    width: `${skill.level ?? 50}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ProjectsTab({
  projects = [],
  compact = false,
}) {
  const visibleProjects = compact
    ? projects.slice(0, 3)
    : projects;

  return (
    <Card title="Proyectos destacados">
      {visibleProjects.length === 0 ? (
        <EmptyState text="Aún no tienes proyectos registrados." />
      ) : (
        <div className="space-y-5">
          {visibleProjects.map((project) => (
            <div
              key={project.id || project.title}
              className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5"
            >
              <p className="text-lg font-black">
                {project.title}
              </p>

              <p className="mt-2 text-sm font-bold leading-6 text-zinc-500">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(project.technologies || []).map(
                  (technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm"
                    >
                      {technology}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ExperienceTab() {
  return (
    <Card title="Experiencia profesional">
      <EmptyState text="La gestión de experiencia se agregará en la siguiente etapa." />
    </Card>
  );
}

function EducationTab({ profile }) {
  return (
    <Card title="Educación">
      <div className="rounded-2xl bg-zinc-50 p-5">
        <p className="font-black">
          {profile.career ||
            "Carrera no configurada"}
        </p>
        <p className="mt-1 text-sm font-bold text-zinc-500">
          Duoc UC
        </p>
      </div>
    </Card>
  );
}

function CertificationsTab() {
  return (
    <Card title="Certificaciones">
      <EmptyState text="Aún no tienes certificaciones registradas." />
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
          Analiza y optimiza tu CV
        </h3>

        <p className="mt-4 text-sm font-medium leading-7 text-zinc-300">
          Compara tu perfil con ofertas reales y detecta palabras
          clave para sistemas ATS.
        </p>

        <Link
          to="/cv-builder"
          className="mt-6 inline-flex rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black"
        >
          Ir al CV Builder
        </Link>
      </div>
    </Card>
  );
}

function EvolutionCard() {
  return (
    <Card title="Evolución de tu perfil">
      <div className="rounded-3xl bg-black p-8 text-white">
        <h3 className="text-4xl font-black">
          +12%
        </h3>
        <p className="mt-2 text-sm font-bold text-green-400">
          Tendencia excelente
        </p>
      </div>
    </Card>
  );
}

function OpportunitiesCard() {
  return (
    <Card title="Oportunidades para ti">
      <div className="rounded-2xl bg-zinc-50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <p className="font-black">
              Ofertas compatibles
            </p>
            <p className="text-sm font-bold text-zinc-500">
              Consulta oportunidades reales
            </p>
          </div>
        </div>

        <Link
          to="/market"
          className="mt-4 block rounded-xl bg-black px-4 py-3 text-center text-sm font-black text-[#ffd500]"
        >
          Ver Market Pulse
        </Link>
      </div>
    </Card>
  );
}

function RoadmapCard() {
  return (
    <Card title="Roadmap IA recomendado">
      <Link
        to="/career-roadmap"
        className="block rounded-2xl bg-black p-5 text-white"
      >
        <Sparkles className="text-[#ffd500]" />
        <p className="mt-3 font-black">
          Ver ruta profesional
        </p>
        <p className="mt-1 text-xs font-bold text-zinc-400">
          Personalizada según tu perfil
        </p>
      </Link>
    </Card>
  );
}

function QuickActions() {
  const actions = [
    [Sparkles, "Mejorar perfil", "/profile"],
    [FileText, "Generar CV", "/cv-builder"],
    [Share2, "Compartir perfil", "/profile"],
    [BarChart3, "Analytics", "/analytics"],
  ];

  return (
    <Card title="Acciones rápidas">
      <div className="grid grid-cols-2 gap-4">
        {actions.map(([Icon, label, route]) => (
          <Link
            key={label}
            to={route}
            className="rounded-3xl border border-zinc-200 bg-white p-5 text-center transition hover:-translate-y-2 hover:border-[#ffd500] hover:shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
              <Icon size={24} />
            </div>

            <p className="text-sm font-black">
              {label}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function DNAStat({ title, value }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4 text-center">
      <p className="text-xs font-bold uppercase text-zinc-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-6 text-center">
      <p className="text-sm font-bold text-zinc-500">
        {text}
      </p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      <div className="mb-5">
        <h2 className="text-lg font-black tracking-tight">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}