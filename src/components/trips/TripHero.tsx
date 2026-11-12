import { CalendarDays, Users } from "lucide-react";
import { getDestinationImage } from "../../mocks/media";
import type { Booking } from "../../models";
import { daysUntil, formatDate } from "../../utils/formatDate";
import { Badge } from "../ui/Badge";

function countdown(days: number) {
  if (days > 1) return `Faltan ${days} días`;
  if (days === 1) return "¡Es mañana!";
  if (days === 0) return "¡Es hoy!";
  return "En curso";
}

export function TripHero({ booking }: { booking: Booking }) {
  const image = getDestinationImage(booking.package.id);
  const days = daysUntil(booking.criteria.departure);
  return (
    <section className="trip-hero" aria-labelledby="trip-hero-title">
      <img
        className="trip-hero__img"
        src={image.src}
        alt={image.alt}
        width={1200}
        height={800}
      />
      <div className="trip-hero__shade" aria-hidden="true" />
      <div className="trip-hero__content">
        <Badge tone="glass">{countdown(days)}</Badge>
        <h2 id="trip-hero-title" className="trip-hero__title">
          {booking.package.destination}
          <span>, {booking.package.country}</span>
        </h2>
        <ul className="trip-hero__meta">
          <li>
            <CalendarDays aria-hidden="true" />
            {formatDate(booking.criteria.departure)} – {formatDate(booking.criteria.returnDate)}
          </li>
          <li>
            <Users aria-hidden="true" />
            {booking.travellers.length} pasajeros · {booking.package.nights} noches
          </li>
        </ul>
      </div>
    </section>
  );
}
