"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function AppLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg bg-admin-grey/60" />
          <Skeleton className="h-4 w-96 rounded-md bg-admin-grey/40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-lg bg-admin-grey/60" />
          <Skeleton className="h-10 w-32 rounded-lg bg-admin-grey/60" />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-admin-grey/50 bg-admin-light/50 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded bg-admin-grey/50" />
              <Skeleton className="h-8 w-8 rounded-full bg-admin-grey/50" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md bg-admin-grey/60" />
            <Skeleton className="h-3 w-36 rounded bg-admin-grey/40" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="p-6 rounded-2xl border border-admin-grey/50 bg-admin-light/50 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-admin-grey/30">
          <Skeleton className="h-6 w-48 rounded-md bg-admin-grey/60" />
          <Skeleton className="h-8 w-32 rounded-md bg-admin-grey/50" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-admin-grey/20">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full bg-admin-grey/50" />
                <Skeleton className="h-4 w-60 rounded bg-admin-grey/50" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-admin-grey/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
