import { motion } from "framer-motion";
import { ArrowRight, Target, Zap } from "lucide-react";
import Pill from "../ui/Pill";
import Progress from "../ui/Progress";
import { opportunities, student } from "../../data/mockData";

export default function Hero() {
    return (
        <section id="platform" className="relative overflow-hidden px-6 pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,#ffd500_0,transparent_27%),radial-gradient(circle_at_85%_25%,rgba(16,16,16,0.12)_0,transparent_28%),linear-gradient(135deg,#fff9d6,#ffffff_48%,#f4f4f5)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-black text-black shadow-sm backdrop-blur-xl">
                <Zap size={16} /> Plataforma premium para empleabilidad institucional
            </div>

            <h2 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-black md:text-7xl xl:text-8xl">
                Inteligencia laboral para conectar talento con oportunidades reales.
            </h2>

            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-zinc-700">
                SkillSync AI transforma datos académicos, habilidades, CV, proyectos
                y señales del mercado laboral en recomendaciones accionables para
                estudiantes, empresas e instituciones.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
                <button className="group inline-flex items-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-black text-[#ffd500] shadow-xl transition hover:-translate-y-0.5">
                Explorar producto
                <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                />
                </button>

                <button className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/80 px-7 py-4 text-sm font-black text-black shadow-sm backdrop-blur transition hover:bg-[#ffd500]">
                Ver propuesta comercial
                </button>
            </div>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            >
            <div className="relative">
                <div className="absolute -inset-5 -z-10 rounded-[3rem] bg-[#ffd500]/40 blur-3xl" />

                <div className="overflow-hidden rounded-[2.4rem] border border-black/10 bg-black shadow-[0_35px_100px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ffd500]" />
                    <span className="h-3 w-3 rounded-full bg-white/30" />
                    <span className="h-3 w-3 rounded-full bg-white/20" />
                    </div>
                    <Pill dark>Career DNA</Pill>
                </div>

                <div className="p-6 text-white">
                    <div className="mb-6 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold text-zinc-400">
                        Perfil recomendado
                        </p>
                        <h3 className="mt-1 text-3xl font-black tracking-tight">
                        {student.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                        {student.career} · {student.campus}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-[#ffd500] px-4 py-3 text-center text-black">
                        <p className="text-3xl font-black leading-none">
                        {student.employability}%
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-wider">
                        empleabilidad
                        </p>
                    </div>
                    </div>

                    <div className="rounded-[1.8rem] bg-white/8 p-5 ring-1 ring-white/10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd500] text-black">
                        <Target size={20} />
                        </div>
                        <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Rol con mayor ajuste
                        </p>
                        <h4 className="text-xl font-black text-[#ffd500]">
                            {student.topRole}
                        </h4>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="mb-2 flex justify-between text-sm font-bold">
                        <span>Perfil profesional</span>
                        <span>{student.profileScore}%</span>
                        </div>
                        <Progress value={student.profileScore} />
                    </div>
                    </div>

                    <div className="mt-5 space-y-3">
                    {opportunities.slice(0, 2).map((job) => (
                        <div
                        key={job.company}
                        className="flex items-center justify-between rounded-3xl bg-white p-4 text-black"
                        >
                        <div>
                            <p className="font-black tracking-tight">{job.role}</p>
                            <p className="mt-0.5 text-sm font-medium text-zinc-500">
                            {job.company}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-black px-3 py-2 text-[#ffd500]">
                            <b>{job.match}%</b>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </motion.div>
        </div>
        </section>
    );
}