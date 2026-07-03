import { cn } from "@/lib/utils";

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-10", className)} aria-hidden>
      <path
        d="M16 2 L28 9 V23 L16 30 L4 23 V9 Z"
        className="fill-primary/10 stroke-primary"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 7 L11 17.5 H15 L14.5 25 L21.5 13.5 H16.5 Z"
        className="fill-primary"
      />
    </svg>
  );
}

export default function AppLoading() {
  return (
    <div className="flex h-full min-h-dvh flex-col items-center justify-center bg-[#0A0C14]">
      <div className="flex flex-col items-center justify-center gap-4">
        <Logo className="animate-[logo-pulse_1.5s_ease-in-out_infinite]" />
        <p className="text-sm text-text-muted font-medium tracking-wide">Loading...</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes logo-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}} />
    </div>
  );
}
