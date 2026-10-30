import type { Booking } from "../../models";
import { formatDate } from "../../utils/formatDate";

export function BookingList({ bookings }: { bookings: Booking[] }) {
  return (
    <section className="panel bookings">
      <h2>
        ▣ Mis reservas <button className="text-button">Ver todas →</button>
      </h2>
      {bookings.slice(0, 3).map((b) => (
        <button key={b.id}>
          <span className={`mini-photo ${b.package.imageClass}`}></span>
          <span>
            <b>
              {b.package.destination}, {b.package.country}
            </b>
            <small>
              {formatDate(b.criteria.departure)} —{" "}
              {formatDate(b.criteria.returnDate)}
            </small>
          </span>
          <em>● {b.status}</em>
          <strong>›</strong>
        </button>
      ))}
    </section>
  );
}
