import { Sparkles } from "lucide-react";

export default function Navbar() {
    return (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-white/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-[#ffd500] shadow-lg">
                <Sparkles size={21} />
            </div>

            <div>
                <h1 className="text-lg font-black tracking-tight">SkillSync AI</h1>
                <p className="text-xs font-bold text-zinc-500">
                Employability Intelligence
                </p>
            </div>
            </div>

            <nav className="hidden items-center gap-7 text-sm font-bold text-zinc-600 lg:flex">
            <a href="#platform" className="hover:text-black">Plataforma</a>
            <a href="#dashboard" className="hover:text-black">Dashboard</a>
            <a href="#value" className="hover:text-black">Valor</a>
            <a href="#security" className="hover:text-black">Seguridad</a>
            </nav>

            <button className="rounded-full bg-black px-5 py-3 text-sm font-black text-[#ffd500] transition hover:scale-[1.02]">
            Solicitar demo
            </button>
        </div>
        </header>
    );
}