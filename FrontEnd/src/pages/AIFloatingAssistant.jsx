import { Sparkles, X, Send } from "lucide-react";
import { useState } from "react";
import { askAssistant } from "../services/aiService";

export default function AIFloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      from: "ai",
      text: "Hola, soy tu asistente de carrera. Puedes preguntarme sobre CV, empleos, skills, QA, React, Docker o entrevistas.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setChat((prev) => [...prev, { from: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    const response = await askAssistant(userMessage);

    setChat((prev) => [...prev, { from: "ai", text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[360px] overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-black p-5 text-white">
            <div>
              <p className="text-sm font-black text-[#ffd500]">SkillSync AI</p>
              <h3 className="text-xl font-black">Asistente de carrera</h3>
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
          </div>

          <div className="flex gap-2 border-t border-zinc-200 bg-white p-4">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Pregunta algo..."
              className="h-12 flex-1 rounded-2xl border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-[#ffd500]"
            />

            <button
              onClick={sendMessage}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd500] text-black"
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