import { Bell, Search } from "lucide-react";

export default function AppTopbar({ title, subtitle }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {title}
          </h1>

          <p className="mt-1 text-sm font-medium text-zinc-500">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              placeholder="Buscar..."
              className="h-12 w-[260px] rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#ffd500]"
            />
          </div>

          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white transition hover:border-[#ffd500] hover:bg-[#ffd500]/10">
            <Bell size={20} />

            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="user"
              className="h-10 w-10 rounded-xl object-cover"
            />

            <div className="hidden text-left lg:block">
              <p className="text-sm font-black">
                Massimo Navarrete
              </p>

              <p className="text-xs font-bold text-zinc-500">
                Estudiante
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}