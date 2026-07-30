import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Bloc-placeholder cu sclipire, pentru stările de loading. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

/** Placeholder în forma unui card de deal, cât se caută pe piață. */
export function DealCardSkeleton({ style }: { style?: CSSProperties }) {
  return (
    <div className="glass rise rounded-3xl p-5" style={style}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-3 w-3/4" />
      <Skeleton className="mt-3 h-8 w-36 rounded-xl" />
    </div>
  );
}
