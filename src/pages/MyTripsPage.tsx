import { ArrowRight, Luggage } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { PageHeader } from "../components/layout/PageHeader";
import { TripHero } from "../components/trips/TripHero";
import { DocumentsCard, OtherTripsCard, ReservationCard } from "../components/trips/TripSidebar";
import { TripSkeleton } from "../components/trips/TripSkeleton";
import { TripTimeline } from "../components/trips/TripTimeline";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { useSimulatedLoading } from "../hooks/useSimulatedLoading";
import { getTripEvents } from "../mocks/tripDetails";
import { useTravel } from "../services/TravelStore";
import { navigate } from "../utils/navigation";

export function MyTripsPage() {
  const { bookings } = useTravel();
  const loading = useSimulatedLoading();
  const [booking, ...others] = bookings;
  const firstName = booking?.travellers[0]?.name ?? "viajero";

  return (
    <>
      <main id="main" className="page mytrips">
        <PageHeader
          eyebrow="Mis viajes"
          title={`Hola, ${firstName}`}
          subtitle="Todo tu viaje en un solo lugar: vuelos, hotel y documentos."
        />
        <div className="container">
          {loading ? (
            <TripSkeleton />
          ) : !booking ? (
            <EmptyState
              icon={<Luggage />}
              title="Todavía no tenés viajes"
              text="Elegí un paquete y tu itinerario va a aparecer acá."
              action={
                <Button
                  onClick={() => navigate("/paquetes")}
                  trailingIcon={<ArrowRight aria-hidden="true" />}
                >
                  Ver paquetes
                </Button>
              }
            />
          ) : (
            <div className="mytrips__layout">
              <div className="mytrips__main">
                <TripHero booking={booking} />
                <section aria-labelledby="itinerary-title">
                  <div className="section-head">
                    <div>
                      <h2 id="itinerary-title" className="section-head__title">
                        Itinerario
                      </h2>
                      <p className="section-head__subtitle">
                        Tocá cada etapa para ver el detalle.
                      </p>
                    </div>
                  </div>
                  <TripTimeline events={getTripEvents(booking)} />
                </section>
              </div>
              <aside className="mytrips__aside" aria-label="Detalles de la reserva">
                <ReservationCard booking={booking} />
                <DocumentsCard booking={booking} />
                <OtherTripsCard bookings={others} />
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
