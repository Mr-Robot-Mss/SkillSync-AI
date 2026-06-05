import { Map, CheckCircle2, Circle, Sparkles } from "lucide-react";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

const steps = [
  ["Base técnica", "SQL, lógica, testing funcional", true],
  ["QA Automation", "Selenium, Postman, Playwright", true],
  ["Frontend/Data Hybrid", "React, Power BI, APIs", false],
  ["Cloud & DevOps", "Docker, AWS, CI/CD", false],
  ["Perfil Senior", "Arquitectura, liderazgo, estrategia", false],
];

export default function CareerRoadmap() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />
      <section className="lg:ml-[290px]">
        <AppTopbar title="Career Roadmap" subtitle="Ruta profesional recomendada por IA" />

        <div className="p-6 lg:p-10">
          <section className="rounded-[32px] bg-black p-8 text-white shadow-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
              <Map size={16} /> AI Career Path
            </div>
            <h1 className="text-5xl font-black">Ruta de crecimiento profesional</h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
              Camino recomendado para avanzar hacia roles tecnológicos con mayor empleabilidad.
            </p>
          </section>

          <section className="mt-6 glass-card rounded-[28px] p-8 shadow-xl">
            <div className="space-y-6">
              {steps.map(([title, desc, done], index) => (
                <div key={title} className="flex gap-5 rounded-3xl bg-white p-5 shadow-sm">
                  <div className="mt-1">
                    {done ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-zinc-300" />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-zinc-400">Etapa {index + 1}</p>
                    <h2 className="mt-1 text-2xl font-black">{title}</h2>
                    <p className="mt-2 text-sm font-bold text-zinc-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-[28px] bg-black p-6 text-white shadow-2xl">
            <Sparkles className="text-[#ffd500]" />
            <h2 className="mt-4 text-2xl font-black">Recomendación IA</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-zinc-300">
              Tu mejor ruta es combinar QA Automation + Data Analytics. Esa mezcla aumenta tu diferenciación frente a perfiles junior tradicionales.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}