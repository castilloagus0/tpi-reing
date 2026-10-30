import { PageBanner } from "../components/layout/PageBanner";
import { Footer } from "../components/layout/Footer";
import { Itinerary } from "../components/trips/Itinerary";
import { BookingList } from "../components/trips/BookingList";
import { Notifications } from "../components/trips/Notifications";
import { TripSide } from "../components/trips/TripSide";
import { Icon } from "../components/ui/Icon";
import { useTravel } from "../services/TravelStore";
import { formatDate } from "../utils/formatDate";

export function MyTripsPage() {
  const { bookings } = useTravel();
  const booking = bookings[0];
  return (
    <>
      <PageBanner
        title="Hola, Laura 👋"
        subtitle="Aquí podés gestionar todos tus viajes, reservas y documentos de forma fácil, rápida y 100% online."
        crumb="MIS VIAJES"
        image
      />
      <main className="trips-page">
        <div className="trips-tabs">
          <button className="active">▣ Mis viajes</button>
          <button>▣ Mis reservas</button>
          <button>▤ Documentos de viaje</button>
          <button>↔ Solicitudes y cambios</button>
          <button>⬟ Asistencia al viajero</button>
          <button>♙ Mis datos</button>
        </div>
        <div className="trips-layout">
          <section className="trip-content">
            <div className="section-heading">
              <h2>Mi próximo viaje</h2>
              <button className="text-button">Ver todos mis viajes →</button>
            </div>
            <article className="next-trip">
              <div className={`trip-photo ${booking.package.imageClass}`}>
                <span>✈ Próximo viaje</span>
                <h2>{booking.package.destination}</h2>
                <p>
                  {booking.package.country} &nbsp; | &nbsp; ▣{" "}
                  {formatDate(booking.criteria.departure)} —{" "}
                  {formatDate(booking.criteria.returnDate)}
                </p>
              </div>
              <div className="trip-detail">
                <div className="reservation-code">
                  Código de reserva <b>{booking.id}</b>
                  <span>● Confirmado</span>
                </div>
                <div className="trip-services">
                  <div>
                    <Icon>✈</Icon>
                    <h3>
                      Vuelos <small>● Confirmado</small>
                    </h3>
                    <p>
                      <b>{booking.criteria.origin.split(" ")[0]}</b> →{" "}
                      <b>{booking.criteria.destination.split(" ")[0]}</b>
                      <br />
                      Ida: {formatDate(booking.criteria.departure)}
                      <br />
                      Vuelta: {formatDate(booking.criteria.returnDate)}
                    </p>
                    <button className="link">Ver detalles del vuelo →</button>
                  </div>
                  <div>
                    <Icon>▦</Icon>
                    <h3>
                      Hotel <small>● Confirmado</small>
                    </h3>
                    <p>
                      <b>{booking.package.hotel}</b>
                      <br />
                      Check-in: {formatDate(booking.criteria.departure)}
                      <br />
                      {booking.package.mealPlan}
                    </p>
                    <button className="link">Ver detalles del hotel →</button>
                  </div>
                </div>
              </div>
            </article>
            <Itinerary booking={booking} />
            <div className="trip-bottom">
              <BookingList bookings={bookings} />
              <Notifications />
            </div>
          </section>
          <TripSide />
        </div>
      </main>
      <Footer />
    </>
  );
}
