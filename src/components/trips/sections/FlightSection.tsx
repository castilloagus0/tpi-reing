import { Plane } from "lucide-react";
import { statusLabel, useFlightStatus } from "../../../hooks/useFlightStatus";
import type { FlightEvent } from "../../../mocks/tripDetails";
import { formatDuration, formatTime } from "../../../utils/formatDate";
import { Badge } from "../../ui/Badge";
import { BoardingPass } from "../BoardingPass";
import { FlightStatusLight, FlightStatusPill } from "../FlightStatusLight";
import { TimelineSection } from "../TimelineSection";

export function FlightSection({
  event,
  defaultOpen,
}: {
  event: FlightEvent;
  defaultOpen?: boolean;
}) {
  const status = useFlightStatus(event.live);

  const summary = (
    <>
      <span className="tsec__meta">
        <span className="tsec__provider">
          {event.airline} · <span className="mono">{event.flightNumber}</span>
        </span>
        {event.live ? (
          <FlightStatusPill status={status} />
        ) : (
          <Badge>Programado</Badge>
        )}
      </span>
      <span className="route">
        <span className="route__end">
          <span className="route__code">{event.from.code}</span>
          <span className="route__time mono">{formatTime(event.at)}</span>
          <span className="route__city">{event.from.city}</span>
        </span>
        <span className="route__path" aria-hidden="true">
          <span className="route__line" />
          <Plane className="route__plane" />
          <span className="route__line" />
          <span className="route__duration">{formatDuration(event.durationMinutes)}</span>
        </span>
        <span className="route__end route__end--to">
          <span className="route__code">{event.to.code}</span>
          <span className="route__time mono">{formatTime(event.arrival)}</span>
          <span className="route__city">{event.to.city}</span>
        </span>
      </span>
    </>
  );

  return (
    <TimelineSection
      label={`${event.title}: ${event.from.city} a ${event.to.city}, ${event.live ? statusLabel(status) : "programado"}. Ver pase de embarque`}
      summary={summary}
      defaultOpen={defaultOpen}
      aside={
        event.live ? (
          <p className="sr-only" aria-live="polite">
            Estado del vuelo {event.flightNumber}: {statusLabel(status)}
          </p>
        ) : undefined
      }
    >
      {event.live && <FlightStatusLight status={status} departure={event.at} />}
      <BoardingPass flight={event} />
    </TimelineSection>
  );
}
