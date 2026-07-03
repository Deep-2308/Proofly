'use client';

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0A0C14] text-[#F7F3EC] p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-amber-500/10 mb-6">
        <TriangleAlert className="size-8 text-amber-500" />
      </div>
      
      <h1 className="font-heading text-2xl font-bold tracking-tight mb-2">
        Something went wrong
      </h1>
      
      <div className="mb-8 max-w-lg rounded-md bg-[#161A28] border border-[#1E2533] p-4 text-left overflow-x-auto">
        <code className="text-xs font-mono text-text-muted">
          {error.message || "An unexpected error occurred."}
        </code>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button onClick={() => reset()} className="bg-amber-500 text-amber-950 hover:bg-amber-400">
          Try Again
        </Button>
        <Button asChild variant="outline" className="border-[#1E2533] hover:bg-[#161A28]">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
