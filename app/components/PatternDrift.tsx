import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSessions } from "~/lib/memory";
import { detectPatternDrift } from "~/lib/drift";

type Drift =
  | { status: "consistent"; earlier?: string }
  | { status: "shifted"; earlier?: string; recent?: string };

export default function PatternDrift() {
  const [drift, setDrift] = useState<Drift | null>(null);

  useEffect(() => {
    const sessions = getSessions();
    const detected = detectPatternDrift(sessions);
    setDrift(detected as Drift | null);
  }, []);

  if (!drift) return null;

  const isShifted = drift.status === "shifted";

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      {/* Label & Status Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isShifted ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">
            Temporal Drift
          </h3>
        </div>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
          isShifted ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {drift.status}
        </span>
      </div>

      <div className="relative space-y-6">
        {/* The "Drift" Visual Line */}
        {isShifted && (
          <div className="absolute left-[11px] top-3 bottom-3 w-[1px] bg-gradient-to-b from-gray-100 via-indigo-200 to-gray-100" />
        )}

        {/* Earlier Point */}
        <div className="flex items-start gap-4 relative">
          <div className={`mt-1.5 w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 z-10 bg-white ${
            isShifted ? 'border-gray-100' : 'border-emerald-100'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isShifted ? 'bg-gray-300' : 'bg-emerald-500'}`} />
          </div>
          <div className="flex-1">
            <span className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Origin Pattern</span>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              {drift.earlier || "Initial baseline established."}
            </p>
          </div>
        </div>

        {/* Shifted Result (Conditional) */}
        {isShifted && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 relative"
          >
            <div className="mt-1.5 w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 border-indigo-500 z-10 bg-white shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-indigo-400 uppercase mb-1">Current State</span>
              <p className="text-sm text-gray-900 font-semibold leading-relaxed">
                {drift.recent}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Subtle Background Text */}
      <div className="absolute -bottom-2 -right-2 text-6xl font-black text-gray-50 pointer-events-none select-none italic">
        {isShifted ? "SHIFT" : "FIXED"}
      </div>
    </motion.div>
  );
}