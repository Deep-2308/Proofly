"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

export function ConfettiTrigger({ fire }: { fire: boolean }) {
  useEffect(() => {
    if (!fire) return;

    // Initial delay of 400ms to sync with badge card animation
    setTimeout(() => {
      // First burst
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#22D3EE", "#F59E0B", "#4ADE80", "#A78BFA", "#ffffff"],
      });

      // Second burst after 200ms
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { x: 0.2, y: 0.5 },
          colors: ["#22D3EE", "#F59E0B"],
        });
      }, 200);

      // Third burst after 400ms
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { x: 0.8, y: 0.5 },
          colors: ["#4ADE80", "#A78BFA"],
        });
      }, 400);
    }, 400);
  }, [fire]);

  return null;
}
