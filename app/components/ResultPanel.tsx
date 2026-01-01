import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThoughtGraph from "./ThoughtGraph";
import NodeDetails from "./NodeDetails";

type Props = {
  data: any;
};

export default function ResultPanel({ data }: Props) {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  if (!data) return null;

  const { reflection, analysis, confidence, graph } = data;
  const confidencePct = confidence?.analysis_confidence 
    ? Math.round(confidence.analysis_confidence * 100) 
    : 0;

  return (
    <div className="mt-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. Primary Reflection Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 p-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-tighter text-gray-300 uppercase">Analysis Confidence</span>
            <div className="flex items-center space-x-2">
              <div className="h-1 w-20 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePct}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
              <span className="text-xs font-mono font-bold text-blue-600">{confidencePct}%</span>
            </div>
          </div>
        </div>

        <div className="max-w-xl">
          <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 mb-6">
            Synthesized Reflection
          </h3>
          <p className="text-xl md:text-2xl font-serif leading-relaxed text-gray-800 italic">
            "{reflection?.summary || "No reflection available"}"
          </p>
        </div>

        {/* Core Tension Highlight */}
        <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-shrink-0 px-3 py-1 rounded bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
            Core Tension
          </div>
          <p className="text-sm font-medium text-gray-600 tracking-tight">
            {reflection?.core_tension || "No significant dissonance detected."}
          </p>
        </div>
      </section>

      {/* 2. Visual Cognitive Map */}
      {graph?.nodes?.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">
              Cognitive Architecture
            </h4>
            <span className="text-[10px] font-mono text-gray-400 uppercase italic">
              Click nodes to expand intent
            </span>
          </div>
          
          <div className="relative aspect-video w-full rounded-3xl bg-[#121212] overflow-hidden shadow-2xl">
             <ThoughtGraph graph={graph} onNodeSelect={setSelectedNode} />
          </div>
          
          <AnimatePresence mode="wait">
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <NodeDetails node={selectedNode} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* 3. Conflict Analysis (Dissonance) */}
      {analysis?.conflicts?.length > 0 && (
        <section className="grid md:grid-cols-2 gap-4">
          {analysis.conflicts.map((c: any, i: number) => (
            <div 
              key={i} 
              className="group p-6 rounded-2xl border border-red-50 hover:border-red-100 bg-white transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xs font-mono font-bold">
                  !
                </span>
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">Dissonance detected</h5>
                  <p className="text-sm text-gray-700 leading-snug">{c.description}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}