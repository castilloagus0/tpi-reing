import { ArrowRight, Download, FileText, Luggage } from "lucide-react";
import type { Booking } from "../../models";
import { downloadTextFile } from "../../utils/download";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { navigate } from "../../utils/navigation";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";

const DOCUMENTS = [
  "Voucher de vuelo",
  "Voucher de hotel",
  "Itinerario completo",
  "Póliza de asistencia",
];

function voucher(booking: Booking, name: string) {
  return [
    `MundoGlobal Travel — ${name}`,
    `Reserva: ${booking.id}`,
    `Destino: ${booking.package.destination}, ${booking.package.country}`,
    `Fechas: ${formatDate(booking.criteria.departure)} – ${formatDate(booking.criteria.returnDate)}`,
    `Hotel: ${booking.package.hotel} (${booking.package.mealPlan})`,
    `Pasajeros: ${booking.travellers.map((t) => `${t.name} ${t.surname}`).join(", ")}`,
    "",
    "Documento de demostración — prototipo educativo.",
  ].join("\n");
}

export function ReservationCard({ booking }: { booking: Booking }) {
  return (
    <Card as="section" aria-labelledby="reservation-title" className="side-card">
      <div className="side-card__head">
        <h2 id="reservation-title" className="side-card__title">
          Tu reserva
        </h2>
        <Badge tone="success" dot>
          {booking.status}
        </Badge>
      </div>
      <dl className="facts facts--stack">
        <div>
          <dt>Código</dt>
          <dd className="mono facts__strong">{booking.id}</dd>
        </div>
        <div>
          <dt>Total pagado</dt>
          <dd className="facts__strong">{formatCurrency(booking.total)}</dd>
        </div>
      </dl>
      <ul className="people" aria-label="Pasajeros">
        {booking.travellers.map((t) => (
          <li key={t.document}>
            <Avatar name={`${t.name} ${t.surname}`} size="sm" />
            <span>
              {t.name} {t.surname}
              <small className="mono">{t.document}</small>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function DocumentsCard({ booking }: { booking: Booking }) {
  return (
    <Card as="section" aria-labelledby="documents-title" className="side-card">
      <h2 id="documents-title" className="side-card__title">
        Documentos
      </h2>
      <ul className="doc-list">
        {DOCUMENTS.map((name) => (
          <li key={name}>
            <button
              type="button"
              className="doc-list__item"
              onClick={() =>
                downloadTextFile(
                  `${booking.id}-${name.toLowerCase().replace(/\s+/g, "-")}.txt`,
                  voucher(booking, name),
                )
              }
            >
              <FileText aria-hidden="true" />
              <span>{name}</span>
              <Download aria-hidden="true" className="doc-list__dl" />
              <span className="sr-only">(descargar)</span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function OtherTripsCard({ bookings }: { bookings: Booking[] }) {
  return (
    <Card as="section" aria-labelledby="other-trips-title" className="side-card">
      <h2 id="other-trips-title" className="side-card__title">
        Otros viajes
      </h2>
      {bookings.length ? (
        <ul className="trip-list">
          {bookings.map((b) => (
            <li key={b.id}>
              <span className="trip-list__name">
                {b.package.destination}, {b.package.country}
              </span>
              <span className="trip-list__meta">
                {formatDate(b.criteria.departure)} · <span className="mono">{b.id}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<Luggage />}
          title="Sin otros viajes por ahora"
          text="Cuando reserves otro paquete lo vas a ver acá."
          action={
            <Button
              variant="link"
              trailingIcon={<ArrowRight aria-hidden="true" />}
              onClick={() => navigate("/paquetes")}
            >
              Explorar paquetes
            </Button>
          }
        />
      )}
    </Card>
  );
}
