// components/skeletons/ExploreSkeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Card key={idx} className="rounded-2xl overflow-hidden shadow-xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl">
          {/* Cover Image */}
          <Skeleton className="w-full aspect-[16/9] rounded-none" />

          <CardHeader>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>

          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
