import React from "react";

export default function Loading() {
  return (
    <div className="space-y-6 p-4 md:p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>

      {/* Main Content Skeleton - Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton - Larger Area */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-64 dark:border-gray-800 dark:bg-white/5">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
            
            <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
