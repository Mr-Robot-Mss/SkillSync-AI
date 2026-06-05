import {
    Brain,
    Building2,
    GraduationCap,
    TrendingUp,
    Users,
    ShieldCheck,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";

export default function AdminDashboard() {
    return (
        <main className="min-h-screen bg-[#f5f5f3] mesh-bg text-black">
        <AppSidebar />

        <section className="lg:ml-[290px] p-8">
            <div className="max-w-7xl mx-auto">
            <Hero />
            <Kpis />
            <MainAnalytics />
            <Partners />
            <BottomStats />
            </div>
        </section>
        </main>
    );
    }

    function Hero() {
    return (
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-black via-[#111111] to-[#1b1b1b] p-10 text-white">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-[#ffd500]/20 blur-3xl rounded-full" />

        <div className="relative z-10">
            <span className="bg-[#ffd500] text-black px-4 py-2 rounded-full text-sm font-black">
            Admin Enterprise
            </span>

            <h1 className="mt-6 text-6xl font-black tracking-[-0.06em] leading-[0.92]">
            SkillSync Institution Intelligence
            </h1>

            <p className="mt-6 max-w-3xl text-zinc-300 text-lg leading-8 font-medium">
            Plataforma institucional para monitorear empleabilidad, habilidades,
            tendencias y brechas académicas mediante IA.
            </p>
        </div>
        </section>
    );
    }

    function Kpis() {
    return (
        <section className="grid md:grid-cols-4 gap-6 mt-8">
        <MetricCard icon={<Users />} value="12.480" label="Estudiantes" />
        <MetricCard icon={<TrendingUp />} value="82%" label="Match promedio" />
        <MetricCard icon={<Building2 />} value="318" label="Empresas" />
        <MetricCard icon={<Brain />} value="24" label="Insights IA" />
        </section>
    );
    }

    function MainAnalytics() {
    return (
        <section className="grid lg:grid-cols-[1fr_380px] gap-6 mt-8">
        <div className="glow-card rounded-[2rem] bg-white p-7">
            <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-black tracking-tight">
                Empleabilidad por carrera
                </h2>

                <p className="text-zinc-500 mt-1 font-medium">
                Comparativa institucional impulsada por IA
                </p>
            </div>

            <span className="bg-[#ffd500] px-4 py-2 rounded-full text-sm font-black">
                LIVE
            </span>
            </div>

            <div className="space-y-6">
            {[
                ["Analista Programador", 84],
                ["Ingeniería Informática", 91],
                ["Diseño UX/UI", 72],
                ["Administración", 66],
                ["Marketing", 74],
            ].map(([career, value]) => (
                <div key={career}>
                <div className="flex justify-between mb-2 font-black">
                    <span>{career}</span>
                    <span>{value}%</span>
                </div>

                <div className="h-3 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                    className="h-full bg-[#ffd500]"
                    style={{ width: `${value}%` }}
                    />
                </div>
                </div>
            ))}
            </div>
        </div>

        <div className="rounded-[2rem] bg-black text-white p-7">
            <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ffd500] text-black flex items-center justify-center">
                <ShieldCheck />
            </div>

            <div>
                <h3 className="text-2xl font-black text-[#ffd500]">
                IA Insights
                </h3>

                <p className="text-zinc-400 text-sm">
                Recomendaciones automáticas
                </p>
            </div>
            </div>

            <div className="space-y-4 mt-8">
            {[
                "Cloud Computing aumentó un 28% en demanda.",
                "Testing QA presenta alta brecha institucional.",
                "Empresas Fintech buscan perfiles React + SQL.",
                "UX/UI mejoró un 11% en contratación.",
            ].map((item) => (
                <div
                key={item}
                className="bg-white/10 border border-white/10 rounded-2xl p-4"
                >
                <p className="font-medium leading-7">{item}</p>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
    }

    function Partners() {
    return (
        <section className="mt-8 glow-card rounded-[2rem] bg-white p-7">
        <div className="flex justify-between items-center mb-8">
            <div>
            <h2 className="text-3xl font-black tracking-tight">
                Empresas partner
            </h2>

            <p className="text-zinc-500 mt-1 font-medium">
                Organizaciones con mayor contratación
            </p>
            </div>

            <button className="bg-black text-[#ffd500] px-5 py-3 rounded-full font-black">
            Ver todas
            </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
            {[
            "Mercado Libre",
            "Banco de Chile",
            "Falabella",
            "Accenture",
            "Sonda",
            "LATAM",
            ].map((company) => (
            <div
                key={company}
                className="rounded-[1.8rem] border border-black/5 bg-[#f8f8f6] p-6 hover:-translate-y-1 transition"
            >
                <div className="w-12 h-12 rounded-2xl bg-[#ffd500] flex items-center justify-center mb-5">
                <Building2 />
                </div>

                <h3 className="text-2xl font-black tracking-tight">{company}</h3>

                <p className="text-zinc-500 mt-2 font-medium">Partner activo</p>
            </div>
            ))}
        </div>
        </section>
    );
    }

    function BottomStats() {
    return (
        <section className="grid md:grid-cols-3 gap-6 mt-8">
        <MiniCard icon={<GraduationCap />} title="Carreras activas" value="24" />
        <MiniCard icon={<Users />} title="Titulados contratados" value="8.412" />
        <MiniCard icon={<TrendingUp />} title="Growth anual" value="+18%" />
        </section>
    );
    }

    function MetricCard({ icon, value, label }) {
    return (
        <div className="glow-card rounded-[2rem] bg-white p-7">
        <div className="w-12 h-12 rounded-2xl bg-[#ffd500] flex items-center justify-center mb-6">
            {icon}
        </div>

        <h2 className="text-5xl font-black tracking-tight">{value}</h2>

        <p className="text-zinc-500 mt-2 font-semibold">{label}</p>
        </div>
    );
    }

    function MiniCard({ icon, title, value }) {
    return (
        <div className="glow-card rounded-[2rem] bg-white p-7">
        <div className="w-12 h-12 rounded-2xl bg-[#ffd500] flex items-center justify-center mb-5">
            {icon}
        </div>

        <h3 className="text-4xl font-black tracking-tight">{value}</h3>

        <p className="text-zinc-500 mt-2 font-semibold">{title}</p>
        </div>
    );
}