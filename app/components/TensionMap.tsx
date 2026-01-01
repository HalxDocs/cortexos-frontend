import { useEffect, useMemo, useState } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  BackgroundVariant, 
  useReactFlow, 
  ReactFlowProvider, 
  type Node, 
  type Edge 
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";

import { getSessions } from "~/lib/memory";
import { buildTensionNodes, buildTensionEdges } from "~/lib/tensionGraph";
import { useForceLayout } from "~/hooks/useForceLayout";
import TensionNode from "./TensionNode";
import { filterSessionsByTime } from "~/lib/timeFilter";
import { exportSVG } from "~/lib/exportGraph";

const nodeTypes = {
  tension: TensionNode,
};

// ----------------------------------
// Visual Helpers
// ----------------------------------
function getGlowColor(lastSeen: number) {
  const days = (Date.now() - lastSeen) / (1000 * 60 * 60 * 24);
  if (days < 3) return "rgba(56, 189, 248, 0.6)"; // Active: Electric Blue
  if (days < 10) return "rgba(251, 191, 36, 0.4)"; // Fading: Amber
  return "rgba(156, 163, 175, 0.2)"; // Dormant: Gray
}

// ----------------------------------
// Sub-Component: Map Content
// ----------------------------------
function TensionMapContent() {
  const allSessions = useMemo(() => getSessions(), []);
  const [time, setTime] = useState<number | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { fitView } = useReactFlow();

  const sessions = useMemo(() => {
    return time ? filterSessionsByTime(allSessions, time) : allSessions;
  }, [allSessions, time]);

  const tensions = useMemo(() => buildTensionNodes(sessions), [sessions]);
  const drifts = useMemo(() => buildTensionEdges(sessions), [sessions]);

  useEffect(() => {
    const rfNodes: Node[] = tensions.map((t) => ({
      id: t.id,
      type: "tension",
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { 
        label: t.label, 
        count: t.count,
        lastSeen: t.lastSeen,
        isNew: (Date.now() - t.lastSeen) < 60000 
      },
      style: {
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(12px)",
        borderRadius: "100%",
        border: `1px solid ${getGlowColor(t.lastSeen)}`,
        boxShadow: `0 0 30px ${getGlowColor(t.lastSeen).replace('0.6', '0.2')}`,
        width: 100 + t.count * 10,
        height: 100 + t.count * 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
    }));

    const rfEdges: Edge[] = drifts.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      animated: true,
      style: {
        stroke: "rgba(255, 255, 255, 0.08)",
        strokeWidth: 1 + e.weight * 1.2,
      },
    }));

    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [tensions, drifts]);

  useForceLayout(nodes, edges, setNodes);

  const minTime = allSessions.length > 0 
    ? Math.min(...allSessions.map(s => new Date(s.createdAt).getTime())) 
    : Date.now() - 86400000;

  return (
    <div className="relative mt-8 h-[650px] w-full rounded-[2.5rem] overflow-hidden bg-[#050505] border border-white/5 shadow-2xl group/map font-sans">
      
      {/* HUD Overlay Layer */}
      <div className="absolute top-8 left-8 z-10 space-y-2 pointer-events-none">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-[10px] font-black tracking-[0.5em] uppercase text-white/50">
            Cognitive Topography
          </h3>
        </div>
        <p className="text-[10px] font-mono text-blue-400/80 uppercase tabular-nums tracking-tight">
          {time ? `T-Minus: ${new Date(time).toLocaleDateString()}` : "Real-time Synthesis"}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="absolute right-8 top-8 z-20 flex space-x-2">
        <button
          onClick={() => fitView({ duration: 800 })}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[9px] font-bold text-white/70 uppercase tracking-widest transition-all"
        >
          Recenter
        </button>
        <button
          onClick={exportSVG}
          className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-full text-[9px] font-bold text-blue-400 uppercase tracking-widest transition-all"
        >
          Export Map
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={true}
        zoomOnPinch={true}
        className="brightness-125 transition-opacity duration-1000"
      >
        <Background 
          color="#1a1a1a" 
          gap={25} 
          size={1} 
          variant={BackgroundVariant.Dots} 
        />
        <Controls 
          className="bg-white/5 border-white/10 fill-white rounded-lg overflow-hidden shadow-none" 
          showInteractive={false} 
        />
      </ReactFlow>

      {/* Temporal Scrubber UI */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[85%] z-20">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-3xl">
          <div className="relative h-4 flex items-center">
            
            {/* Session Markers (Timeline Ticks) */}
            {allSessions.map((s) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute w-1 h-3 bg-blue-500/30 rounded-full"
                style={{ 
                  left: `${((new Date(s.createdAt).getTime() - minTime) / (Date.now() - minTime)) * 100}%` 
                }}
              />
            ))}
            
            <input
              type="range"
              min={minTime}
              max={Date.now()}
              value={time ?? Date.now()}
              onChange={(e) => setTime(Number(e.target.value))}
              className="absolute w-full appearance-none bg-transparent cursor-pointer z-10
                         [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:bg-white/10
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-[0_0_20px_#3b82f6]
                         [&::-webkit-slider-thumb]:-translate-y-[9px] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black
                         transition-all active:[&::-webkit-slider-thumb]:scale-125"
            />
          </div>
          
          <div className="flex justify-between mt-4 text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">
            <span>Archive Origin</span>
            <span>Present Flux</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------
// Main Export with Provider
// ----------------------------------
export default function TensionMap() {
  return (
    <ReactFlowProvider>
      <TensionMapContent />
    </ReactFlowProvider>
  );
}