import { Skeleton } from "../ui/Skeleton";

export function TripSkeleton() {
  return (
    <div className="trip-skeleton" aria-busy="true" aria-label="Cargando tu viaje">
      <Skeleton shape="media" className="trip-skeleton__hero" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="trip-skeleton__row">
          <Skeleton shape="circle" />
          <div className="trip-skeleton__card">
            <Skeleton shape="title" />
            <Skeleton />
            <Skeleton className="trip-skeleton__short" />
          </div>
        </div>
      ))}
    </div>
  );
}
