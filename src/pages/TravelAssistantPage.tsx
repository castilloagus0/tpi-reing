import { ArrowLeft, Phone, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { AssistantChat } from "../components/assistant/AssistantChat";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { getTripEvents, type HotelEvent } from "../mocks/tripDetails";
import type { AssistantContext } from "../mocks/assistantFlow";
import { useTravel } from "../services/TravelStore";
import { navigate } from "../utils/navigation";

export function TravelAssistantPage() {
  const { bookings } = useTravel();
  const booking = bookings[0];

  const context = useMemo<AssistantContext>(() => {
    const hotel = booking
      ? (getTripEvents(booking).find((e) => e.kind === "hotel") as HotelEvent | undefined)
      : undefined;
    return {
      name: booking?.travellers[0]?.name ?? "viajero",
      hotel: booking?.package.hotel ?? "tu hotel",
      hotelCode: hotel?.reservationCode ?? "—",
      destination: booking?.package.destination ?? "tu destino",
      bookingId: booking?.id ?? "MG0000",
    };
  }, [booking]);

  return (
    <main id="main" className="page assistant-page">
      <div className="container assistant-page__inner">
        <div className="assistant-page__top">
          <Button
            variant="ghost"
            size="sm"
            leadingIcon={<ArrowLeft aria-hidden="true" />}
            onClick={() => navigate("/mis-viajes")}
          >
            Mis viajes
          </Button>
          <div>
            <p className="eyebrow">Asistencia al viaje</p>
            <h1 className="assistant-page__title">¿En qué te ayudamos?</h1>
          </div>
        </div>

        <div className="assistant-page__grid">
          <AssistantChat context={context} />

          <aside className="assistant-page__aside" aria-label="Tu cobertura">
            <Card className="coverage">
              <div className="coverage__head">
                <ShieldCheck aria-hidden="true" />
                <Badge tone="success" dot>
                  Activa
                </Badge>
              </div>
              <h2 className="coverage__title">MundoGlobal Plus</h2>
              <p className="coverage__text">
                Cobertura médica, equipaje y asistencia 24/7 durante todo tu viaje.
              </p>
              <dl className="facts facts--stack">
                <div>
                  <dt>Gastos médicos</dt>
                  <dd>hasta USD 60.000</dd>
                </div>
                <div>
                  <dt>Equipaje</dt>
                  <dd>hasta USD 1.200</dd>
                </div>
              </dl>
            </Card>
            <Card className="coverage coverage--urgent">
              <h2 className="coverage__title">¿Es una emergencia?</h2>
              <p className="coverage__text">Central médica 24/7 (número de demostración).</p>
              <p className="coverage__phone mono">
                <Phone aria-hidden="true" />
                +54 11 5555-0100
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
