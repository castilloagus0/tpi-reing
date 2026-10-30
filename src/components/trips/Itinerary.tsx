import type { Booking } from "../../models";
import { formatDate } from "../../utils/formatDate";
import { Icon } from "../ui/Icon";

export function Itinerary({ booking }: { booking: Booking }) {
  const items = [
    [
      "✈",
      "Vuelo de salida",
      `${booking.criteria.origin} → ${booking.criteria.destination}`,
    ],
    ["▦", "Check-in hotel", booking.package.hotel],
    ["◉", "Día libre", `Explorá ${booking.package.destination}`],
    ["▤", "Tour sugerido", "Experiencia memorable"],
    [
      "✈",
      "Vuelo de regreso",
      `${booking.criteria.destination} → ${booking.criteria.origin}`,
    ],
  ];
  return (
    <section className="itinerary">
      <div className="section-heading">
        <h2>Itinerario de tu viaje</h2>
        <button className="text-button">Ver itinerario completo →</button>
      </div>
      <div className="timeline">
        {items.map(([icon, title, text], i) => (
          <article key={title}>
            <small>
              {i === 0
                ? formatDate(booking.criteria.departure)
                : i === 4
                  ? formatDate(booking.criteria.returnDate)
                  : `Día ${i + 1}`}
            </small>
            <Icon>{icon}</Icon>
            <b>{title}</b>
            <p>{text}</p>
            <span>✓ Confirmado</span>
          </article>
        ))}
      </div>
    </section>
  );
}
