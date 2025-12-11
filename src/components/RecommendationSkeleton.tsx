import { Skeleton } from "@/components/ui/skeleton";

interface RecommendationSkeletonProps {
  count?: number;
}

export const RecommendationSkeleton = ({ count = 4 }: RecommendationSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
};
