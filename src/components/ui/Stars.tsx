import { Star } from "lucide-react";

export function Stars({ count }: { count: number }) {
  return (
    <span className="stars" role="img" aria-label={`${count} estrellas`}>
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} aria-hidden="true" />
      ))}
    </span>
  );
}
