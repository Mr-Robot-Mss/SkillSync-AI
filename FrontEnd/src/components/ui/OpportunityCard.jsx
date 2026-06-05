import { Building2 } from "lucide-react";
import Pill from "./Pill";

export default function OpportunityCard({ job }) {
    return (
        <article className="rounded-[1.8rem] border border-black/5 bg-white p-5 shadow-[0_14px_45px_rgba(0,0,0,0.06)] transition hover:-translate-y-1">
        <div className="flex items-start justify-between gap-5">
            <div>
            <div className="mb-3 flex flex-wrap gap-2">
                <Pill>{job.type}</Pill>
                <Pill>{job.salary}</Pill>
            </div>

            <h4 className="text-xl font-black tracking-tight text-black">
                {job.role}
            </h4>

            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                <Building2 size={15} /> {job.company}
            </p>
            </div>

            <div className="min-w-24 rounded-3xl bg-black px-4 py-3 text-center text-[#ffd500]">
            <p className="text-3xl font-black leading-none">{job.match}%</p>
            <p className="mt-1 text-[11px] font-black uppercase tracking-wider">
                match
            </p>
            </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
            <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700"
            >
                {tag}
            </span>
            ))}
        </div>

        <div className="mt-5 rounded-2xl border-l-4 border-[#ffd500] bg-zinc-50 p-4 text-sm text-zinc-700">
            <b className="text-black">Brecha IA:</b> reforzar {job.missing} para
            aumentar la compatibilidad.
        </div>
        </article>
    );
}