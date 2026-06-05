import { useState } from "react";
import { Mic, Sparkles, Send, CheckCircle2 } from "lucide-react";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";
import { analyzeInterviewAnswer } from "../services/aiService";

export default function InterviewSimulator() {
  const [answer, setAnswer] = useState("");
  const [review, setReview] = useState(null);

const evaluate = async () => {
  const result = await analyzeInterviewAnswer(answer);
  setReview(result);
};

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-black">
      <AppSidebar />
      <section className="lg:ml-[290px]">
        <AppTopbar title="Simulador de Entrevista" subtitle="Practica entrevistas técnicas con IA" />

        <div className="p-6 lg:p-10">
          <section className="rounded-[32px] bg-black p-8 text-white shadow-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ffd500]/10 px-4 py-2 text-sm font-black text-[#ffd500]">
              <Mic size={16} /> AI Interview Coach
            </div>
            <h1 className="text-5xl font-black">Entrevista técnica</h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-300">
              Responde preguntas técnicas y recibe feedback automático.
            </p>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="glass-card rounded-[28px] p-6 shadow-xl">
              <h2 className="text-2xl font-black">Pregunta</h2>
              <p className="mt-3 rounded-2xl bg-zinc-50 p-5 text-sm font-bold leading-7 text-zinc-600">
                Cuéntame cómo abordarías la automatización de pruebas para una aplicación web con login, dashboard y consumo de APIs.
              </p>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="mt-5 min-h-[220px] w-full rounded-2xl border border-zinc-200 bg-white p-5 text-sm font-bold outline-none focus:border-[#ffd500]"
              />

              <button
                onClick={evaluate}
                className="mt-5 flex items-center gap-2 rounded-2xl bg-[#ffd500] px-5 py-3 text-sm font-black text-black"
              >
                <Send size={16} /> Evaluar respuesta
              </button>
            </div>

            <aside className="rounded-[28px] bg-black p-6 text-white shadow-2xl">
              <Sparkles className="text-[#ffd500]" />
              <h2 className="mt-4 text-2xl font-black">Feedback IA</h2>

              {review ? (
                <>
                  <p className="mt-5 text-5xl font-black text-[#ffd500]">{review.score}%</p>
                  <p className="mt-4 text-sm font-medium leading-7 text-zinc-300">{review.feedback}</p>
                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                    <CheckCircle2 className="text-green-400" />
                    <p className="text-sm font-bold">Recomendación generada</p>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm font-medium leading-7 text-zinc-300">
                  Responde la pregunta para recibir evaluación automática.
                </p>
              )}
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}