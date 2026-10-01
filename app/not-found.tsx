import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0A0C14] text-[#F7F3EC]">
      {/* Animated subtle radial gradient blob */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-[#22D3EE]/10 blur-[100px] animate-[pulse-blob_4s_ease-in-out_infinite_alternate]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        <h1 className="font-heading text-9xl font-extrabold text-[#22D3EE]">404</h1>
        <h2 className="text-3xl font-semibold tracking-tight">Page not found</h2>
        <p className="text-text-muted max-w-sm">
          This page does not exist or was moved.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild className="bg-primary text-[#0A0C14] hover:bg-primary/90">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-blob {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
      `}} />
    </div>
  );
}
