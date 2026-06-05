import {
  ArrowRight,
  Brain,
  Building2,
  Globe,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Login() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,213,0,0.28),transparent_28%),radial-gradient(circle_at_90%_70%,rgba(255,255,255,0.12),transparent_24%)]" />

      <section className="relative z-10 grid min-h-screen lg:grid-cols-[1fr_520px]">
        <div className="hidden lg:flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 rounded-2xl bg-[#ffd500] text-black flex items-center justify-center">
              <Sparkles />
            </div>

            <div>
              <h1 className="text-xl font-black">SkillSync AI</h1>
              <p className="text-xs text-zinc-400 font-semibold">
                Employability Intelligence
              </p>
            </div>
          </Link>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm font-black text-[#ffd500]">
              <Brain size={16} />
              Plataforma institucional con IA
            </span>

            <h2 className="mt-7 text-7xl font-black leading-[0.9] tracking-[-0.06em]">
              Conecta talento, mercado y futuro laboral.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 font-medium">
              Accede a dashboards inteligentes de empleabilidad, mercado laboral,
              brechas académicas e insights predictivos.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                ["82%", "match promedio"],
                ["14.281", "ofertas activas"],
                ["24", "insights IA"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl bg-white/10 border border-white/10 p-5"
                >
                  <h3 className="text-4xl font-black text-[#ffd500]">
                    {value}
                  </h3>

                  <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400 font-bold">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-zinc-500 font-medium">
            © 2026 SkillSync AI · Smart Employability Platform
          </p>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-[460px] rounded-[2.5rem] bg-white text-black p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <div className="lg:hidden mb-8 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-black text-[#ffd500] flex items-center justify-center">
                <Sparkles />
              </div>

              <div>
                <h1 className="text-lg font-black">SkillSync AI</h1>
                <p className="text-xs text-zinc-500 font-semibold">
                  Employability Intelligence
                </p>
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#ffd500] flex items-center justify-center mb-6">
              <LockKeyhole />
            </div>

            <h2 className="text-4xl font-black tracking-[-0.04em]">
              Accede a tu plataforma
            </h2>

            <p className="mt-3 text-zinc-500 font-medium leading-7">
              Selecciona el acceso según el tipo de usuario del sistema.
            </p>

            <form className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-black text-zinc-700">
                  Correo institucional
                </label>

                <input
                  type="email"
                  placeholder="nombre@duocuc.cl"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-zinc-50 px-5 py-4 font-semibold outline-none focus:border-[#ffd500]"
                />
              </div>

              <div>
                <label className="text-sm font-black text-zinc-700">
                  Contraseña
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-zinc-50 px-5 py-4 font-semibold outline-none focus:border-[#ffd500]"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                  <input type="checkbox" className="accent-[#ffd500]" />
                  Recordarme
                </label>

                <button type="button" className="text-sm font-black text-black">
                  Recuperar acceso
                </button>
              </div>

              <Link
                to="/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 font-black text-[#ffd500] transition hover:scale-[1.01]"
              >
                Entrar como estudiante
                <ArrowRight size={18} />
              </Link>
            </form>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <QuickAccess
                icon={<Building2 size={18} />}
                title="Estudiante"
                subtitle="Career DNA"
                to="/dashboard"
              />

              <QuickAccess
                icon={<Brain size={18} />}
                title="Admin"
                subtitle="Duoc IA"
                to="/admin"
              />

              <QuickAccess
                icon={<Globe size={18} />}
                title="Market"
                subtitle="Pulse AI"
                to="/market"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickAccess({ icon, title, subtitle, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-black/10 bg-zinc-50 p-4 transition hover:bg-[#ffd500]"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#ffd500]">
        {icon}
      </div>

      <p className="font-black leading-tight">{title}</p>
      <p className="mt-1 text-xs font-bold text-zinc-500">{subtitle}</p>
    </Link>
  );
}