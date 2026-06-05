import { Bell, BriefcaseBusiness, Sparkles, TrendingUp } from "lucide-react";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

const notifications = [
  [BriefcaseBusiness, "Nueva oferta QA Automation disponible", "Hace 3 min"],
  [TrendingUp, "Tu match promedio subió a 89%", "Hace 2 horas"],
  [Sparkles, "IA recomienda aprender Docker", "Hace 1 día"],
];

export default function Notifications() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />
      <section className="lg:ml-[290px]">
        <AppTopbar title="Notificaciones" subtitle="Alertas inteligentes de empleabilidad" />

        <div className="p-6 lg:p-10">
          <section className="rounded-[32px] bg-black p-8 text-white shadow-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
              <Bell size={16} /> Smart Alerts
            </div>
            <h1 className="text-5xl font-black">Centro de notificaciones</h1>
          </section>

          <section className="mt-6 space-y-4">
            {notifications.map(([Icon, title, time]) => (
              <article key={title} className="glass-card rounded-[28px] p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#ffd500]">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className="font-black">{title}</h2>
                    <p className="mt-1 text-sm font-bold text-zinc-500">{time}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}