import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onSubmit: (text: string) => Promise<void>;
  loading: boolean;
};

export default function ThoughtInput({ onSubmit, loading }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = useCallback(async () => {
    if (!text.trim() || loading) return;
    await onSubmit(text);
    setText("");
  }, [text, loading, onSubmit]);

  // ✅ FIXED: Keyboard shortcut (Remix-safe)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="relative w-full transition-all duration-1000">
      
      {/* Background Brain-Wave Aura */}
      <div
        className={`absolute -inset-4 bg-gradient-to-r from-blue-50/20 via-transparent to-indigo-50/20 rounded-[3rem] blur-3xl transition-opacity duration-1000 ${
          text.length > 0 ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative">
        <textarea
          ref={textareaRef}
          className={`
            w-full min-h-[200px] bg-transparent resize-none p-6
            text-xl md:text-2xl font-serif font-light leading-relaxed tracking-tight
            placeholder:text-gray-200 focus:outline-none transition-colors duration-500
            ${loading ? "text-gray-300 pointer-events-none" : "text-gray-800"}
          `}
          placeholder="Unfold the loop..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}   // ✅ ONLY CHANGE
          disabled={loading}
          autoFocus
        />

        {/* Loading Overlay Shimmer */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%] animate-shimmer"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between px-6 py-4 mt-2 border-t border-gray-50">
        
        {/* Telemetry Info */}
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-[0.2em] text-gray-300 uppercase">
            {loading ? "Neural Mapping in Progress" : "Input Stream"}
          </span>
          <span className="text-[9px] font-mono text-gray-400 mt-0.5">
            {loading
              ? "Decrypting Latent Patterns..."
              : `${text.split(/\s+/).filter(Boolean).length} Words / ${text.length} Chars`}
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-4">
          <span className="hidden md:block text-[9px] font-mono text-gray-300">
            [ ⌘ + ↵ ]
          </span>

          <button
  type="button"
  disabled={loading || !text.trim()}
  onClick={handleSubmit}
  className={`
    relative flex items-center justify-center
    h-12 w-full md:w-auto md:px-8
    rounded-full
    transition-all duration-500 overflow-hidden
    ${
      !text.trim() || loading
        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
        : "bg-black text-white hover:shadow-2xl hover:shadow-black/20 active:scale-90"
    }
  `}
>
  <AnimatePresence mode="wait">
    {loading ? (
      <motion.div
        key="loading"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
      />
    ) : (
      <motion.span
        key="idle"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-bold uppercase tracking-[0.2em]"
      >
        Analyze
      </motion.span>
    )}
  </AnimatePresence>
</button>
        </div>
      </div>

      {/* Progress Underline */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-50" />
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-black"
        initial={{ width: 0 }}
        animate={{ width: text.length > 0 ? "100%" : "0%" }}
        transition={{ duration: 1.5, ease: "circOut" }}
      />
    </div>
  );
}