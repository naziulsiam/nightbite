import { Skeleton } from '@/components/ui/skeleton';

export const RestaurantCardSkeleton = () => {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="w-full h-40" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const HeroCardSkeleton = () => {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="w-full h-44" />
      <div className="p-4 -mt-6 relative z-10 space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const ListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <RestaurantCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="flex gap-2 overflow-x-auto py-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
      ))}
    </div>
  );
};

export default RestaurantCardSkeleton;
