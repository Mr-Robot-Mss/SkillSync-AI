import {
  Sparkles,
  FileText,
  Brain,
  Mic,
  Target,
  Wand2,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

const tools = [
  {
    icon: FileText,
    title: "Generador de CV",
    desc: "Crea un CV optimizado para ATS según tu perfil y rol objetivo.",
    status: "Disponible",
  },
  {
    icon: Brain,
    title: "Análisis de Skill Gap",
    desc: "Detecta brechas entre tus habilidades y empleos disponibles.",
    status: "Disponible",
  },
  {
    icon: Mic,
    title: "Simulador de Entrevista",
    desc: "Practica preguntas técnicas y recibe feedback automatizado.",
    status: "Próximamente",
  },
  {
    icon: Target,
    title: "Match Laboral IA",
    desc: "Calcula compatibilidad entre tu perfil y ofertas laborales.",
    status: "Disponible",
  },
];

export default function AITools() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />

      <section className="lg:ml-[290px]">
        <AppTopbar
          title="AI Tools"
          subtitle="Herramientas inteligentes para potenciar tu perfil profesional"
        />

        <div className="p-6 lg:p-10">
          <section className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.22),transparent_28%)]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
                <Sparkles size={16} />
                SkillSync AI Engine
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                Herramientas IA para tu carrera
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
                Genera CVs, analiza brechas, prepara entrevistas y mide tu
                compatibilidad con oportunidades laborales.
              </p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-2">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <article
                  key={tool.title}
                  className="glass-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(0,0,0,0.10)]"
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                    <Icon size={28} />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black">{tool.title}</h2>

                      <p className="mt-2 text-sm font-bold leading-6 text-zinc-500">
                        {tool.desc}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#ffd500]/20 px-3 py-1 text-xs font-black text-[#b89400]">
                      {tool.status}
                    </span>
                  </div>

                  <button className="mt-6 flex items-center gap-2 rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black transition hover:scale-[1.03]">
                    <Wand2 size={16} />
                    Usar herramienta
                  </button>
                </article>
              );
            })}
          </section>
        </div>
      </section>
    </main>
  );
}