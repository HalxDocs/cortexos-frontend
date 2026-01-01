import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThoughtInput from "~/components/ThoughtInput";
import ResultPanel from "~/components/ResultPanel";
import SessionHistory from "~/components/SessionHistory";
import PatternInsight from "~/components/PatternInsight";
import PatternDrift from "~/components/PatternDrift";
import TensionMap from "~/components/TensionMap";
import { analyzeThought } from "~/lib/api";
import { saveSession } from "~/lib/memory";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");

  async function handleSubmit(text: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeThought(text);
      setResult(res.data);
      saveSession(res.data);
    } catch (err: any) {
      setError(err.message || "Connection to CORTEX failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FBFBFB] text-[#121212] selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">
        
        {/* Navigation / Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <h1 className="text-xs font-black tracking-[0.2em] uppercase">Cortex / v1.0</h1>
            <p className="text-xs text-gray-400 font-mono italic">Observing internal drift...</p>
          </div>
          
          <nav className="flex bg-gray-100 p-1 rounded-full">
            {(["list", "map"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1 text-[10px] uppercase tracking-widest transition-all rounded-full ${
                  view === v ? "bg-white shadow-sm font-bold" : "text-gray-400 hover:text-black"
                }`}
              >
                {v}
              </button>
            ))}
          </nav>
        </header>

        {/* Core Input Section */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-light tracking-tight mb-2 text-gray-800">
              What is <span className="italic font-serif">circling</span> right now?
            </h2>
          </div>
          
          <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-2 transition-focus-within:border-gray-300">
            <ThoughtInput onSubmit={handleSubmit} loading={loading} />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-xs font-mono text-red-500 bg-red-50 p-2 rounded border border-red-100"
            >
              [!] {error}
            </motion.p>
          )}
        </section>

        {/* Dynamic Analysis View */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-16"
            >
              <ResultPanel data={result} />
            </motion.div>
          )}
        </AnimatePresence>

        <hr className="border-gray-100 mb-16" />

        {/* Exploratory Views */}
        <section className="relative">
          <AnimatePresence mode="wait">
            {view === "map" ? (
              <motion.div 
                key="map"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="aspect-square w-full bg-gray-50 rounded-3xl border border-dashed border-gray-200"
              >
                <TensionMap />
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-12"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <PatternInsight />
                  <PatternDrift />
                </div>
                <div className="pt-8 border-t border-gray-50">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 font-bold">Temporal Log</h3>
                  <SessionHistory />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}