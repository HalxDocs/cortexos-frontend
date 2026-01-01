import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSessions } from "~/lib/memory";
import { detectCoreTensionPattern } from "~/lib/pattern";

export default function PatternInsight() {
  const [pattern, setPattern] = useState<string | null>(null);

  useEffect(() => {
    const sessions = getSessions();
    const detected = detectCoreTensionPattern(sessions);
    setPattern(detected);
  }, []);

  if (!pattern) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group mt-8"
    >
      {/* Background Decorative Element (The "Halo") */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
      
      <div className="relative overflow-hidden rounded-2xl border border-blue-100/50 bg-white p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          
          {/* Visual Indicator: The Recurring Loop */}
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
            <svg 
              className="w-6 h-6 text-blue-500 animate-[spin_10s_linear_infinite]" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-400">
                Cognitive Pattern Identified
              </h3>
              <div className="h-px flex-1 bg-blue-50" />
            </div>

            <div className="relative">
              <p className="text-lg md:text-xl text-gray-800 font-medium leading-tight">
                You are currently navigating a recurring loop regarding{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-indigo-600 font-bold italic tracking-tight">
                    "{pattern}"
                  </span>
                  <motion.span 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="absolute bottom-1 left-0 h-2 bg-indigo-50 z-0"
                  />
                </span>
              </p>
            </div>
            
            <p className="text-[11px] font-mono text-gray-400 pt-2 uppercase tracking-tight">
              Observed across {getSessions().length} temporal checkpoints
            </p>
          </div>
        </div>

        {/* The "Corner Brackets" Aesthetic */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-100 rounded-tl-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-100 rounded-br-lg" />
      </div>
    </motion.div>
  );
}