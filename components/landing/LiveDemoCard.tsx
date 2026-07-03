"use client";

import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CHALLENGE_TEXT =
  "You are a frontend engineer at a fintech startup. The design team has handed you a Figma spec for a real-time transaction dashboard. Your task is to architect the component hierarchy, manage the WebSocket connection for live data, and implement optimistic UI updates...";

export function LiveDemoCard() {
  const [typedText, setTypedText] = useState("");
  const [typing, setTyping] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    const startTyping = () => {
      setTypedText("");
      setTyping(true);
      setShowEvaluation(false);

      let currentIndex = 0;
      intervalId = setInterval(() => {
        if (currentIndex < CHALLENGE_TEXT.length - 1) {
          setTypedText((prev) => prev + CHALLENGE_TEXT[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setTyping(false);
          // Wait 3s before showing evaluation
          timeoutId = setTimeout(() => {
            setShowEvaluation(true);
            
            // Reset after 4s (progress bar takes 2s to fill, then 2s pause)
            timeoutId = setTimeout(() => {
              startTyping();
            }, 4000);
          }, 3000);
        }
      }, 25);
    };

    startTyping();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="glass-card-v2 group relative overflow-hidden rounded-[2rem] p-8 transition-all hover:glow-primary animate-[floating_4s_ease-in-out_infinite_alternate]">
      {/* Floating animation keyframes via style if tw-animate doesn't have it, or we can use custom classes in globals.css. We'll use inline style for floating or framer-motion */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floating {
          from { transform: translateY(0); }
          to { transform: translateY(8px); }
        }
      `}} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-proof-violet/30 bg-proof-violet/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-proof-violet">
          <Sparkles className="size-4" />
          AI Generated Challenge
        </div>
        <div className="text-xs font-mono text-text-muted bg-surface/50 px-3 py-1.5 rounded-lg border border-white/5">
          React • Intermediate
        </div>
      </div>

      {/* Challenge Text */}
      <div className="min-h-[140px] bg-black/40 rounded-xl border border-white/5 p-5 font-mono text-sm leading-relaxed text-text">
        {typedText}
        {typing && <span className="inline-block w-2 h-4 bg-proof-violet ml-1 animate-pulse" />}
      </div>

      {/* Evaluation Results */}
      <div className="mt-6 min-h-[120px]">
        <AnimatePresence>
          {showEvaluation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="rounded-xl border border-success/30 bg-success/10 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 text-success font-bold text-sm">
                  <CheckCircle2 className="size-4" />
                  Evaluation Complete
                </div>
                <div className="font-heading text-xl font-black text-success">
                  91 <span className="text-sm text-success/60">/ 100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/50 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "91%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-success shadow-[0_0_10px_var(--color-success)]"
                />
              </div>

              {/* Feedback */}
              <p className="text-xs text-success/80 font-medium">
                <span className="opacity-60 uppercase tracking-widest text-[10px] mr-2">Strength</span>
                Excellent architectural thinking
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
