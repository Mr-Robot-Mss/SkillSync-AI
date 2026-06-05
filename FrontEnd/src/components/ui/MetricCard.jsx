import Pill from "./Pill";

export default function MetricCard({ icon: Icon, label, value, trend }) {
    return (
        <div className="rounded-[1.8rem] border border-black/5 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)] transition hover:-translate-y-1">
        <div className="mb-6 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd500] text-black">
            <Icon size={21} />
            </div>
            <Pill>{trend}</Pill>
        </div>

        <p className="text-sm font-semibold text-zinc-500">{label}</p>
        <h3 className="mt-1 text-4xl font-black tracking-tight text-black">
            {value}
        </h3>
        </div>
    );
}