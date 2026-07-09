import { Sparkles, X, Send, Lock } from "lucide-react";
import { useState } from "react";
import { askAssistant } from "../services/aiService";

export default function AIFloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [remainingQuestions, setRemainingQuestions] = useState(null);
  const [plan, setPlan] = useState("free");
  const [blocked, setBlocked] = useState(false);
  const [chat, setChat] = useState([
    {
      from: "ai",
      text: "Hola, soy tu asistente de carrera. Puedes preguntarme sobre CV, ATS, empleos, QA, React, Docker o entrevistas.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading || blocked) return;

    const userMessage = message.trim();

    setChat((prev) => [...prev, { from: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await askAssistant(userMessage, "demo-user");

      setPlan(response.plan || "free");
      setBlocked(Boolean(response.blocked));
      setRemainingQuestions(response.remaining_questions ?? null);

      setChat((prev) => [
        ...prev,
        {
          from: "ai",
          text: response.answer || "No pude generar una respuesta.",
        },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          from: "ai",
          text: error.message || "Ocurrió un error al consultar la IA.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[380px] overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-black p-5 text-white">
            <div>
              <p className="text-sm font-black text-[#ffd500]">SkillSync AI</p>
              <h3 className="text-xl font-black">Asistente de carrera</h3>

              <p className="mt-1 text-xs font-bold text-zinc-300">
                Plan {plan} ·{" "}
                {remainingQuestions === null
                  ? "Consulta disponible"
                  : `${remainingQuestions} preguntas restantes`}
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto bg-[#f7f7f5] p-4">
            {chat.map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl p-4 text-sm font-bold leading-6 ${
                  item.from === "ai"
                    ? "bg-white text-zinc-700"
                    : "bg-black text-[#ffd500]"
                }`}
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <div className="rounded-2xl bg-white p-4 text-sm font-bold text-zinc-500">
                Pensando...
              </div>
            )}

            {blocked && (
              <div className="rounded-2xl border border-[#ffd500] bg-[#fff8cc] p-4 text-sm font-bold text-zinc-800">
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  Premium $2.500
                </div>
                <p className="mt-2">
                  Alcanzaste el límite diario del plan gratuito. Activa Premium
                  para usar más consultas IA.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-zinc-200 bg-white p-4">
            <input
              value={message}
              disabled={blocked}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder={
                blocked ? "Límite alcanzado" : "Pregunta algo sobre tu carrera..."
              }
              className="h-12 flex-1 rounded-2xl border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-[#ffd500] disabled:bg-zinc-100"
            />

            <button
              onClick={sendMessage}
              disabled={loading || blocked}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd500] text-black disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[#ffd500] shadow-2xl transition hover:scale-110"
      >
        <Sparkles size={28} />
      </button>
    </div>
  );
}