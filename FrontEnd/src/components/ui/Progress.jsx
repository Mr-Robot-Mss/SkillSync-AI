export default function Progress({ value }) {
    return (
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div
            className="h-full rounded-full bg-[#ffd500]"
            style={{ width: `${value}%` }}
        />
        </div>
    );
}