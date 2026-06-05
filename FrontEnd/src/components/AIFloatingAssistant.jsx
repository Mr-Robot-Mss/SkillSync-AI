import { Sparkles, X } from "lucide-react";
import { useState } from "react";

export default function AIFloatingAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[340px] rounded-[28px] border border-zinc-200 bg-white p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-zinc-400">SkillSync AI</p>
              <h3 className="text-xl font-black">Asistente de carrera</h3>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-zinc-100 p-2 hover:bg-zinc-200"
            >
              <X size={16} />
            </button>
          </div>

          <div className="rounded-2xl bg-black p-4 text-white">
            <p className="text-sm font-medium leading-6 text-zinc-300">
              Detecté que tu perfil tiene alta compatibilidad con roles de
              Frontend, QA Automation y Data Analyst.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <button className="w-full rounded-2xl bg-[#ffd500] px-4 py-3 text-sm font-black text-black">
              Optimizar perfil
            </button>

            <button className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-black">
              Generar recomendaciones
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[#ffd500] shadow-2xl transition hover:scale-110"
      >
        <Sparkles size={28} />
      </button>
    </div>
  );
}