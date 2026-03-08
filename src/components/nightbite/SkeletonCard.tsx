const SkeletonCard = () => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="w-full h-40 bg-muted shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="flex items-center gap-2">
        <div className="h-4 bg-muted rounded w-12" />
        <div className="h-6 bg-muted rounded w-16" />
      </div>
      <div className="h-1.5 bg-muted rounded-full w-full" />
      <div className="flex justify-between">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-8 bg-muted rounded-xl w-28" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
