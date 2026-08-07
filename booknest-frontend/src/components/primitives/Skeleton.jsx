export function Skeleton({ className = '' }) {
  return <div className={'animate-pulse bg-hairline/50 rounded-lg ' + className} />;
}

export function BookCardSkeleton() {
  return (
    <div className="bg-paper-raised border border-hairline rounded-2xl p-3.5 w-40 shrink-0">
      <Skeleton className="h-36 w-full mb-3 rounded-xl" />
      <Skeleton className="h-4 w-4/5 mb-2" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  );
}
