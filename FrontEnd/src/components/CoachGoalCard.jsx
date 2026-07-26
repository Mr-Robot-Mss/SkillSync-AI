import { useEffect, useState } from "react";
import { CalendarDays, CircleAlert, LoaderCircle, Pencil, Save, X } from "lucide-react";

import { getCoachGoal, saveCoachGoal } from "../services/coachService";

const EMPTY_GOAL = {
  title: "",
  description: "",
  target_date: "",
  progress: 0,
  status: "active",
};

export default function CoachGoalCard({ suggestedGoal = "" }) {
  const [goal, setGoal] = useState(null);
  const [form, setForm] = useState(EMPTY_GOAL);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getCoachGoal()
      .then((data) => {
        if (!active) return;
        setGoal(data);
        setForm(data ? normalizeGoal(data) : { ...EMPTY_GOAL, title: suggestedGoal });
        setEditing(!data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [suggestedGoal]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "progress" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const saved = await saveCoachGoal(form);
      const normalized = normalizeGoal(saved || form);
      setGoal(normalized);
      setForm(normalized);
      setEditing(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    setForm(goal ? normalizeGoal(goal) : { ...EMPTY_GOAL, title: suggestedGoal });
    setEditing(false);
    setError("");
  }

  if (loading) {
    return (
      <div className="rounded-[2rem] bg-black p-6 text-white">
        <LoaderCircle className="animate-spin text-[#ffd500]" />
        <p className="mt-4 font-bold text-zinc-300">Cargando tu meta profesional...</p>
      </div>
    );
  }

  if (editing) {
    return (
      <form onSubmit={handleSubmit} className="rounded-[2rem] bg-black p-6 text-white shadow-[0_35px_120px_rgba(0,0,0,0.25)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-[#ffd500]">Meta profesional</p>
            <h3 className="mt-2 text-2xl font-black">Define tu próximo logro</h3>
          </div>
          {goal && (
            <button type="button" onClick={cancelEditing} className="rounded-full bg-white/10 p-2" aria-label="Cancelar edición">
              <X size={18} />
            </button>
          )}
        </div>

        <label className="mt-5 block text-sm font-bold text-zinc-300">
          Título
          <input name="title" value={form.title} onChange={updateField} required minLength={3} maxLength={120} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#ffd500]" />
        </label>

        <label className="mt-4 block text-sm font-bold text-zinc-300">
          Descripción
          <textarea name="description" value={form.description} onChange={updateField} maxLength={500} rows={3} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#ffd500]" />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-zinc-300">
            Fecha objetivo
            <input name="target_date" type="date" value={form.target_date || ""} onChange={updateField} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#ffd500]" />
          </label>
          <label className="text-sm font-bold text-zinc-300">
            Estado
            <select name="status" value={form.status} onChange={updateField} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#191919] px-4 py-3 text-white outline-none focus:border-[#ffd500]">
              <option value="active">Activa</option>
              <option value="paused">Pausada</option>
              <option value="completed">Completada</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block text-sm font-bold text-zinc-300">
          Progreso: {form.progress}%
          <input name="progress" type="range" min="0" max="100" value={form.progress} onChange={updateField} className="mt-3 w-full accent-[#ffd500]" />
        </label>

        {error && (
          <div className="mt-4 flex gap-2 rounded-2xl bg-red-500/10 p-3 text-sm font-semibold text-red-200">
            <CircleAlert size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <button disabled={saving} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#ffd500] px-5 py-3 font-black text-black disabled:opacity-60">
          {saving ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? "Guardando..." : "Guardar meta"}
        </button>
      </form>
    );
  }

  return (
    <div className="rounded-[2rem] bg-black p-6 text-white shadow-[0_35px_120px_rgba(0,0,0,0.25)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-black uppercase tracking-wider text-[#ffd500]">Meta profesional</p>
        <button onClick={() => setEditing(true)} className="rounded-full bg-white/10 p-2" aria-label="Editar meta">
          <Pencil size={17} />
        </button>
      </div>

      <h3 className="mt-3 text-3xl font-black">{goal?.title}</h3>
      {goal?.description && <p className="mt-3 font-medium leading-7 text-zinc-400">{goal.description}</p>}

      <div className="mt-5 flex items-center justify-between text-sm font-bold">
        <span>Progreso</span>
        <span className="text-[#ffd500]">{goal?.progress || 0}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
        <div className="h-full bg-[#ffd500]" style={{ width: `${Math.max(0, Math.min(100, Number(goal?.progress) || 0))}%` }} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wider">
        <span className="rounded-full bg-white/10 px-3 py-2">{statusLabel(goal?.status)}</span>
        {goal?.target_date && (
          <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
            <CalendarDays size={14} />
            {formatDate(goal.target_date)}
          </span>
        )}
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-red-300">{error}</p>}
    </div>
  );
}

function normalizeGoal(goal) {
  return {
    title: goal?.title || "",
    description: goal?.description || "",
    target_date: goal?.target_date || "",
    progress: Number(goal?.progress || 0),
    status: goal?.status || "active",
  };
}

function statusLabel(status) {
  return {
    active: "Activa",
    paused: "Pausada",
    completed: "Completada",
  }[status] || "Activa";
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
