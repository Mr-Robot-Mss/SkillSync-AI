export default function Pill({ children, dark = false }) {
    return (
        <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-tight ${
            dark
            ? "bg-black text-[#ffd500]"
            : "border border-black/10 bg-white text-zinc-700 shadow-sm"
        }`}
        >
        {children}
        </span>
    );
}s