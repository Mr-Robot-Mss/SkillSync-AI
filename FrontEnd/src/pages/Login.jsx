import { useState } from "react";
import {
  Sparkles,
  Mail,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("xd@duocuc.cl");
  const [password, setPassword] = useState("123456");

  const handleLogin = (e) => {
    e.preventDefault();

    const hasOnboarding = localStorage.getItem("skillsync_onboarding_result");
    navigate(hasOnboarding ? "/profile" : "/onboarding");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src="/duoc-campus.jpg"
        alt="Duoc UC"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-100"
      />

      <div className="absolute inset-0 z-[1] bg-black/35" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
      <div className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_20%_30%,rgba(255,213,0,.16),transparent_40%)]" />

      <section className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between p-8 lg:p-12">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd500] text-2xl font-black text-black shadow-xl">
              S
            </div>

            <div>
              <h1 className="text-2xl font-black">SkillSync AI</h1>
              <p className="text-sm font-bold text-zinc-300">
                Employability Intelligence
              </p>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffd500]/30 bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
              <Sparkles size={16} />
              Plataforma institucional con IA
            </div>

            <h2 className="text-5xl font-black leading-none tracking-tight md:text-7xl">
              Conecta talento,
              <br />
              mercado y futuro
              <br />
              laboral.
            </h2>

            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-zinc-200">
              Accede a dashboards inteligentes de empleabilidad, mercado
              laboral, brechas académicas e insights predictivos.
            </p>

            <div className="mt-10 grid max-w-3xl gap-4 md:grid-cols-3">
              <MiniStat value="82%" label="MATCH PROMEDIO" />
              <MiniStat value="14.281" label="OFERTAS ACTIVAS" />
              <MiniStat value="24" label="INSIGHTS IA" />
            </div>
          </div>

          <p className="text-xs font-medium text-zinc-400">
            © 2026 SkillSync AI · Smart Employability Platform
          </p>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md rounded-[36px] bg-white p-8 text-black shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
          >
            <div className="mb-8">
              <div className="mb-8 flex justify-center">
                <img
                  src="/logo-duoc.png"
                  alt="Duoc UC"
                  className="h-14 w-auto object-contain"
                />
              </div>

              <h2 className="text-center text-4xl font-black leading-tight tracking-tight">
                Accede a tu
                <br />
                plataforma
              </h2>

              <p className="mt-4 text-center text-sm font-bold leading-6 text-zinc-500">
                Selecciona el acceso según el tipo de usuario del sistema.
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-zinc-700">
                Correo institucional
              </span>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="nombre@duocuc.cl"
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-sm font-bold outline-none transition focus:border-[#ffd500]"
                />
              </div>
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-zinc-700">
                Contraseña
              </span>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-sm font-bold outline-none transition focus:border-[#ffd500]"
                />
              </div>
            </label>

            <div className="mt-5 flex items-center justify-between text-xs font-bold text-zinc-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Recordarme
              </label>

              <button type="button" className="font-black text-black">
                Recuperar acceso
              </button>
            </div>

            <button
              type="submit"
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-[#ffd500] transition hover:scale-[1.02]"
            >
              Entrar como estudiante
              <ArrowRight size={18} />
            </button>

            <div className="mt-7 grid grid-cols-3 gap-3">
              <AccessCard
                icon={GraduationCap}
                title="Estudiante"
                sub="Career DNA"
              />
              <AccessCard icon={ShieldCheck} title="Admin" sub="Duoc IA" />
              <AccessCard icon={Globe2} title="Market" sub="Pulse AI" />
            </div>
          </form>
        </div>
      </section>

      <button className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-black text-[#ffd500] shadow-2xl">
        <Sparkles size={24} />
      </button>
    </main>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
      <p className="text-3xl font-black text-[#ffd500]">{value}</p>
      <p className="mt-1 text-xs font-black text-zinc-300">{label}</p>
    </div>
  );
}

function AccessCard({ icon: Icon, title, sub }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-4 transition hover:border-[#ffd500] hover:bg-[#ffd500]/10">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#ffd500]">
        <Icon size={18} />
      </div>

      <p className="text-sm font-black">{title}</p>
      <p className="mt-1 text-xs font-bold text-zinc-500">{sub}</p>
    </div>
  );
}