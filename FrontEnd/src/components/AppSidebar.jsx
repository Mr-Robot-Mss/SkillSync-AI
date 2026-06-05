import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  BriefcaseBusiness,
  BarChart3,
  Sparkles,
  Settings,
  BookmarkCheck,
  Brain,
  FileText,
  Mic,
  Map,
  Bell,
} from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: User, label: "Perfil", path: "/profile" },
  { icon: Brain, label: "Onboarding IA", path: "/onboarding" },
  { icon: BriefcaseBusiness, label: "Oportunidades", path: "/market" },
  { icon: BookmarkCheck, label: "Guardadas", path: "/saved-jobs" },
  { icon: Brain, label: "Skill Gap", path: "/skill-gap" },
  { icon: FileText, label: "CV Builder", path: "/cv-builder" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Mic, label: "Entrevista", path: "/interview-simulator" },
  { icon: Map, label: "Roadmap", path: "/career-roadmap" },
  { icon: Bell, label: "Notificaciones", path: "/notifications" },
  { icon: Sparkles, label: "AI Tools", path: "/ai-tools" },
];

const mobileItems = [
  { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
  { icon: User, label: "Perfil", path: "/profile" },
  { icon: BriefcaseBusiness, label: "Jobs", path: "/market" },
  { icon: Sparkles, label: "AI", path: "/ai-tools" },
];

export default function AppSidebar() {
  return (
    <>
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[290px] border-r border-zinc-200 bg-white/80 backdrop-blur-xl xl:flex xl:flex-col">
        <div className="border-b border-zinc-200 px-8 py-8">
          <NavLink to="/" className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl font-black text-[#ffd500] shadow-xl">
              S
            </div>

            <div>
              <h2 className="text-xl font-black tracking-tight">
                SkillSync AI
              </h2>
              <p className="text-sm font-bold text-zinc-500">
                Career Platform
              </p>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-5">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-sm font-black transition-all duration-300 ${
                    isActive
                      ? "bg-black text-[#ffd500] shadow-xl"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
                  }`
                }
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200 p-5">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-black transition ${
                isActive
                  ? "bg-black text-[#ffd500]"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
              }`
            }
          >
            <Settings size={20} />
            Configuración
          </NavLink>
        </div>
      </aside>

      <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-[28px] border border-zinc-200 bg-white/90 p-2 shadow-2xl backdrop-blur-xl xl:hidden">
        <div className="grid grid-cols-4 gap-2">
          {mobileItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center rounded-2xl px-3 py-3 text-xs font-black transition ${
                    isActive
                      ? "bg-black text-[#ffd500]"
                      : "text-zinc-500 hover:bg-zinc-100"
                  }`
                }
              >
                <Icon size={20} />
                <span className="mt-1">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}