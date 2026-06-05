import { ArrowLeft, Home, SearchX, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,213,0,0.25),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.12),transparent_24%)]" />

        <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
            <div className="max-w-3xl text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#ffd500] text-black">
                <SearchX size={38} />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-[#ffd500]">
                <Sparkles size={16} />
                Ruta no encontrada
            </div>

            <h1 className="mt-8 text-7xl font-black tracking-[-0.06em] md:text-9xl">
                404
            </h1>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em]">
                Esta sección aún no existe.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg font-medium leading-8 text-zinc-300">
                La ruta que intentas abrir no está disponible dentro de SkillSync AI.
                Puedes volver al inicio o entrar directamente a la plataforma.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                to="/"
                className="flex items-center gap-2 rounded-full bg-[#ffd500] px-6 py-4 font-black text-black transition hover:scale-[1.02]"
                >
                <Home size={18} />
                Ir al inicio
                </Link>

                <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/20"
                >
                <ArrowLeft size={18} />
                Ir al dashboard
                </Link>
            </div>
            </div>
        </section>
        </main>
    );
}