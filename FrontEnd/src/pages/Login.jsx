import { useEffect, useState } from "react";
import {
  Sparkles,
  Mail,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Globe2,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  loginUser,
} from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberSession, setRememberSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      return;
    }

    const hasOnboarding =
      localStorage.getItem("skillsync_onboarding_result") ||
      sessionStorage.getItem("skillsync_onboarding_result");

    navigate(hasOnboarding ? "/dashboard" : "/onboarding", {
      replace: true,
    });
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        throw new Error("Ingresa tu correo institucional.");
      }

      if (!normalizedEmail.endsWith("@duocuc.cl")) {
        throw new Error(
          "Debes ingresar con un correo institucional @duocuc.cl."
        );
      }

      if (!password) {
        throw new Error("Ingresa tu contraseña.");
      }

      if (password.length < 6) {
        throw new Error(
          "La contraseña debe tener al menos 6 caracteres."
        );
      }

      const result = await loginUser(
        normalizedEmail,
        password,
        rememberSession
      );

      if (result.first_login) {
        navigate("/onboarding", { replace: true });
        return;
      }

      const hasOnboarding =
        localStorage.getItem("skillsync_onboarding_result") ||
        sessionStorage.getItem("skillsync_onboarding_result");

      navigate(hasOnboarding ? "/dashboard" : "/onboarding", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message ||
          "No se pudo iniciar sesión. Verifica tus datos e inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src="/duoc-campus.jpg"
        alt="Campus Duoc UC"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
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
                Ingresa con tu correo institucional Duoc UC. En el primer acceso
                se creará automáticamente tu cuenta.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-600"
              >
                {error}
              </div>
            )}

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
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="nombre.apellido@duocuc.cl"
                  required
                  disabled={loading}
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-sm font-bold outline-none transition focus:border-[#ffd500] disabled:cursor-not-allowed disabled:bg-zinc-100"
                />
              </div>
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-zinc-700">
                Contraseña
              </span>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  required
                  minLength={6}
                  disabled={loading}
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-sm font-bold outline-none transition focus:border-[#ffd500] disabled:cursor-not-allowed disabled:bg-zinc-100"
                />
              </div>
            </label>

            <div className="mt-5 flex items-center justify-between gap-4 text-xs font-bold text-zinc-600">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(event) =>
                    setRememberSession(event.target.checked)
                  }
                  disabled={loading}
                  className="h-4 w-4 accent-black"
                />
                Mantener sesión iniciada
              </label>

              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="font-black text-black transition hover:text-[#c59b00]"
              >
                Cambiar contraseña
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-[#ffd500] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Validando acceso..." : "Entrar como estudiante"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p className="mt-4 text-center text-xs font-semibold leading-5 text-zinc-500">
              Si tu correo todavía no está registrado, se creará una cuenta en
              el primer inicio de sesión. La contraseña se almacena protegida
              mediante hash.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-3">
              <AccessCard
                icon={GraduationCap}
                title="Estudiante"
                sub="Career DNA"
              />
              <AccessCard
                icon={ShieldCheck}
                title="Admin"
                sub="Duoc IA"
              />
              <AccessCard
                icon={Globe2}
                title="Market"
                sub="Pulse AI"
              />
            </div>
          </form>
        </div>
      </section>

      <button
        type="button"
        aria-label="Abrir asistente SkillSync AI"
        className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-black text-[#ffd500] shadow-2xl"
      >
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