// components/skeletons/PostViewSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function PostViewSkeleton() {
    return (
        <article className="rounded-xl shadow-sm overflow-hidden bg-card p-8 space-y-6">
            {/* Cover image */}
            <Skeleton className="w-full aspect-[16/5] rounded-xl" />

            {/* Author section */}
            <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>

            {/* Title */}
            <Skeleton className="h-6 w-3/4" />

            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
            </div>

            {/* Content */}
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                ))}
            </div>

            {/* Post actions */}
            <div className="flex items-center space-x-6 pt-4">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>

            {/* Comment input */}
            <Skeleton className="h-10 w-full rounded-xl" />

            {/* Comment placeholders */}
            <div className="space-y-6 mt-4">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex space-x-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}
