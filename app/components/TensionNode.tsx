import { memo } from "react";
import { Handle, Position } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";

export default memo(({ data }: any) => {
  const { label, count, firstSeen, lastSeen, isNew } = data;

  // Scale logic: The orb grows as the thought repeats
  const baseSize = 100;
  const scale = Math.min(1 + count * 0.08, 1.8);

  return (
    <div className="relative flex items-center justify-center">
      {/* HIDDEN HANDLES: Required for ReactFlow edges to connect. 
         Opacity is 0 so the lines appear to float into the center.
      */}
      <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />

      <motion.div 
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* THE ATMOSPHERIC PULSE: Outer glow that 'breathes' */}
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1], 
            opacity: [0.15, 0.3, 0.15] 
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 rounded-full bg-blue-500/30 blur-2xl"
        />

        {/* THE CENTRAL ORB: The main interactive body */}
        <div 
          className="relative flex items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl transition-all duration-700 group-hover:border-blue-400/60 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
          style={{ 
            width: baseSize * scale, 
            height: baseSize * scale 
          }}
        >
          <div className="px-6 text-center select-none">
            <div className="text-[11px] font-black leading-tight text-white/90 uppercase tracking-tighter drop-shadow-md">
              {label}
            </div>
            <div className="mt-1.5 text-[8px] font-mono text-blue-400/90 font-bold uppercase tracking-[0.2em]">
              SIG.{count.toString().padStart(2, '0')}
            </div>
          </div>

          {/* NEW SIGNAL PING: Only shows if the session is fresh */}
          {isNew && (
            <div className="absolute -top-2 -right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-black"></span>
            </div>
          )}
        </div>

        {/* THE HUD TOOLTIP: Appears on hover with telemetry data */}
        <div className="absolute left-1/2 bottom-full mb-6 w-60 -translate-x-1/2 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none transition-all duration-500 ease-out z-50">
          <div className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 p-5 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* HUD Header */}
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2.5">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">
                Neural Scan
              </span>
              <span className="text-[9px] font-mono text-blue-400/80 font-bold">
                [{label.substring(0, 4).toUpperCase()}]
              </span>
            </div>

            {/* Telemetry Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Recurrence</span>
                  <span className="text-xs text-slate-100 font-semibold">{count} Sessions</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Priority</span>
                  <span className="text-xs text-blue-400 font-semibold">Critical</span>
                </div>
              </div>

              <div className="flex flex-col border-t border-white/5 pt-3">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Temporal Log</span>
                <span className="text-[10px] text-slate-300 font-mono mt-1.5 tabular-nums">
                  {firstSeen} <span className="text-slate-600 px-1">»</span> {lastSeen}
                </span>
              </div>
            </div>

            {/* Visual Intensity Bar */}
            <div className="mt-5 flex items-center gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 flex-1 rounded-sm transition-colors duration-700 ${
                    i < count ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-white/5'
                  }`} 
                />
              ))}
            </div>
          </div>
          
          {/* HUD Pointer Stem */}
          <div className="mx-auto w-px h-6 bg-gradient-to-t from-blue-500 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
});