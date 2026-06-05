import { useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

export default function Settings() {
  const [name, setName] = useState("Camila Rojas");
  const [email, setEmail] = useState("camila.rojas@duocuc.cl");
  const [city, setCity] = useState("Santiago, Chile");

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />
      <section className="lg:ml-[290px]">
        <AppTopbar title="Configuración" subtitle="Administra datos del perfil" />

        <div className="p-6 lg:p-10">
          <section className="rounded-[32px] bg-black p-8 text-white shadow-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
              <SettingsIcon size={16} /> User Settings
            </div>
            <h1 className="text-5xl font-black">Configuración de cuenta</h1>
          </section>

          <section className="mt-6 glass-card max-w-3xl rounded-[28px] p-6 shadow-xl">
            <Input label="Nombre" value={name} onChange={setName} />
            <Input label="Correo" value={email} onChange={setEmail} />
            <Input label="Ciudad" value={city} onChange={setCity} />

            <button className="mt-6 flex items-center gap-2 rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black">
              <Save size={16} /> Guardar cambios
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="mt-5 block first:mt-0">
      <span className="mb-2 block text-xs font-black uppercase text-zinc-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#ffd500]"
      />
    </label>
  );
}