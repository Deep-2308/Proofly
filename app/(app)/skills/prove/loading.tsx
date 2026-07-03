export default function ProveSkillLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8 lg:flex-row lg:items-start lg:gap-12">
      
      {/* Left Panel - Skeleton */}
      <div className="flex w-full flex-col gap-8 lg:w-[380px] shrink-0">
        <div className="space-y-4">
          <div className="h-10 w-3/4 rounded-lg bg-surface-2 ai-shimmer" />
          <div className="h-5 w-full rounded bg-surface-2 ai-shimmer" />
          <div className="h-5 w-5/6 rounded bg-surface-2 ai-shimmer" />
        </div>
        
        {/* Skill pill skeleton grid (3x3) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded-xl bg-surface border border-border ai-shimmer" />
          ))}
        </div>
      </div>

      {/* Right Panel - Empty State Placeholder Skeleton */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 p-12 min-h-[400px]">
        <div className="h-20 w-20 rounded-full bg-surface-2 ai-shimmer mb-6" />
        <div className="h-6 w-48 rounded bg-surface-2 ai-shimmer mb-3" />
        <div className="h-4 w-64 rounded bg-surface-2 ai-shimmer" />
      </div>
      
    </div>
  );
}
