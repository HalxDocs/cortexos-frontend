import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type CortexSession, getSessions } from "~/lib/memory";

export default function SessionHistory() {
  const [sessions, setSessions] = useState<CortexSession[]>([]);

  useEffect(() => {
    // We reverse the array so the most recent (highest ID or timestamp) is index 0
    const historicalData = getSessions();
    setSessions([...historicalData].reverse());
  }, []);

  if (sessions.length === 0) return null;

  return (
    <div className="mt-16 relative">
      {/* Archive Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">
            Neural Archive
          </h2>
          <div className="h-[1px] w-12 bg-gray-200" />
        </div>
        <span className="text-[10px] font-mono text-gray-300 uppercase">
          Sorted: Recency Descending
        </span>
      </div>

      <div className="relative pl-8 space-y-12">
        {/* The "Thread of Time" Line */}
        <div className="absolute left-[11px] top-2 bottom-0 w-[1px] bg-gradient-to-b from-gray-200 via-gray-100 to-transparent" />

        {sessions.map((s, idx) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative group"
          >
            {/* Timeline Indicator */}
            <div className="absolute -left-[26.5px] top-1.5 w-3 h-3 rounded-full border-2 border-[#FBFBFB] bg-gray-100 group-hover:bg-black group-hover:scale-110 transition-all duration-300 shadow-sm" />

            <div className="flex flex-col space-y-3">
              {/* Telemetry Data */}
              <div className="flex items-center space-x-4 text-[9px] font-mono uppercase tracking-widest">
                <span className="text-black font-bold">
                  Entry {sessions.length - idx}
                </span>
                <span className="text-gray-400">
                  {new Date(s.createdAt).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <div className="flex-1 h-px bg-gray-50 group-hover:bg-gray-100 transition-colors" />
                <span className="text-gray-400 tabular-nums">
                  Sig: {Math.round(s.confidence * 100)}%
                </span>
              </div>

              {/* Reflection Card */}
              <div className="relative p-5 rounded-2xl bg-white border border-gray-100/60 shadow-sm group-hover:shadow-md group-hover:border-gray-200 transition-all duration-500">
                {/* Subtle highlight for the very first (newest) item */}
                {idx === 0 && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-1 px-2 py-0.5 bg-blue-500 text-[8px] font-bold text-white rounded-full uppercase tracking-tighter">
                    Latest Drift
                  </div>
                )}
                
                <p className="text-sm md:text-base text-gray-800 leading-relaxed font-medium">
                  {s.coreTension}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}