import { Check, Copy, ExternalLink, Loader2, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { useClipboard } from "../../../hooks/useClipboard";
import type { HotelEvent } from "../../../mocks/tripDetails";
import { formatDayShort, formatTime } from "../../../utils/formatDate";
import { getCurrentPosition, googleMapsUrl } from "../../../utils/maps";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Stars } from "../../ui/Stars";
import { TimelineSection } from "../TimelineSection";

type MapState =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "ready"; url: string; withRoute: boolean };

export function HotelSection({
  event,
  defaultOpen,
}: {
  event: HotelEvent;
  defaultOpen?: boolean;
}) {
  const { copy, copied, failed } = useClipboard();
  const [map, setMap] = useState<MapState>({ kind: "idle" });
  const codeLabel = event.allInclusive
    ? "Código de reserva All Inclusive"
    : "Código de reserva del hotel";

  async function openMap() {
    setMap({ kind: "locating" });
    const origin = await getCurrentPosition();
    const url = googleMapsUrl(event.coords, origin);
    window.open(url, "_blank", "noopener,noreferrer");
    // Si el navegador bloquea la pestaña (por la espera del permiso),
    // queda un enlace visible para abrirla con un clic.
    setMap({ kind: "ready", url, withRoute: Boolean(origin) });
  }

  const summary = (
    <>
      <span className="tsec__meta">
        <span className="tsec__provider">
          Check-in {formatTime(event.at)} · {event.nights} noches
        </span>
        {event.allInclusive ? (
          <Badge tone="info">Todo incluido</Badge>
        ) : (
          <Badge>{event.mealPlan}</Badge>
        )}
      </span>
      <span className="hotel-summary">
        <img
          className="hotel-summary__thumb"
          src={event.image.thumb}
          alt=""
          loading="lazy"
          width={56}
          height={56}
        />
        <span>
          <span className="hotel-summary__name">{event.name}</span>
          <Stars count={event.stars} />
        </span>
      </span>
    </>
  );

  return (
    <TimelineSection
      label={`${event.title}: ${event.name}, ${event.stars} estrellas. Ver detalles del hotel`}
      summary={summary}
      defaultOpen={defaultOpen}
    >
      <div className="hotel">
        <img
          className="hotel__photo"
          src={event.image.src}
          alt={event.image.alt}
          loading="lazy"
          width={1200}
          height={675}
        />
        <div className="hotel__body">
          <div className="hotel__title">
            <h4>{event.name}</h4>
            <Stars count={event.stars} />
          </div>
          <p className="hotel__address">
            <MapPin aria-hidden="true" />
            {event.address}
          </p>

          <dl className="facts">
            <div>
              <dt>Check-in</dt>
              <dd>
                {formatDayShort(event.at)} ·{" "}
                <span className="mono">{formatTime(event.at)}</span>
              </dd>
            </div>
            <div>
              <dt>Check-out</dt>
              <dd>
                {formatDayShort(event.checkOut)} ·{" "}
                <span className="mono">{formatTime(event.checkOut)}</span>
              </dd>
            </div>
            <div>
              <dt>Huéspedes</dt>
              <dd>{event.guests} adultos</dd>
            </div>
            <div>
              <dt>Régimen</dt>
              <dd>{event.mealPlan}</dd>
            </div>
          </dl>

          <div className="code-box">
            <div>
              <p className="code-box__label">{codeLabel}</p>
              <p className="code-box__value mono">{event.reservationCode}</p>
            </div>
            <Button
              variant={copied ? "secondary" : "ink"}
              size="sm"
              className={copied ? "is-copied" : undefined}
              onClick={() => copy(event.reservationCode)}
              leadingIcon={copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              aria-label={`Copiar ${codeLabel.toLowerCase()}`}
            >
              {copied ? "Copiado" : "Copiar"}
            </Button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Código copiado al portapapeles" : ""}
              {failed ? "No se pudo copiar el código" : ""}
            </span>
          </div>

          <div className="hotel__actions">
            <Button
              variant="secondary"
              onClick={openMap}
              disabled={map.kind === "locating"}
              aria-describedby={`${event.id}-map-hint`}
              leadingIcon={
                map.kind === "locating" ? (
                  <Loader2 className="spin" aria-hidden="true" />
                ) : (
                  <Navigation aria-hidden="true" />
                )
              }
            >
              {map.kind === "locating" ? "Buscando tu ubicación…" : "Ver en mapa"}
            </Button>
            <p id={`${event.id}-map-hint`} className="hotel__hint" aria-live="polite">
              {map.kind === "ready" ? (
                <>
                  {map.withRoute
                    ? "Abrimos la ruta desde tu ubicación."
                    : "Sin acceso a tu ubicación: te mostramos solo el hotel."}{" "}
                  <a href={map.url} target="_blank" rel="noopener noreferrer">
                    Abrir Google Maps
                    <ExternalLink aria-hidden="true" />
                  </a>
                </>
              ) : (
                "Si nos das permiso de ubicación, te armamos la ruta hasta el hotel."
              )}
            </p>
          </div>
        </div>
      </div>
    </TimelineSection>
  );
}
