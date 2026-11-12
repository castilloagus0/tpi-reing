import { BedDouble, CarFront, PlaneLanding, PlaneTakeoff, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import type { TripEvent } from "../../mocks/tripDetails";
import { cx } from "../../utils/cx";
import { formatDayShort, formatTime } from "../../utils/formatDate";
import { sectionRegistry } from "./sections/registry";

function markerIcon(event: TripEvent): LucideIcon {
  if (event.kind === "hotel") return BedDouble;
  if (event.kind === "transfer") return CarFront;
  return event.direction === "return" ? PlaneLanding : PlaneTakeoff;
}

export function TripTimeline({
  events,
  openFirst = true,
}: {
  events: TripEvent[];
  openFirst?: boolean;
}) {
  return (
    <ol className="trip-timeline">
      {events.map((event, index) => {
        const Section = sectionRegistry[event.kind] as ComponentType<{
          event: TripEvent;
          defaultOpen?: boolean;
        }>;
        const Icon = markerIcon(event);
        const next = index === 0;
        return (
          <li key={event.id} className={cx("tl-item", next && "tl-item--next")}>
            <span className="tl-marker" aria-hidden="true">
              <Icon />
            </span>
            <p className="tl-when">
              <time dateTime={event.at}>
                <span className="tl-when__time mono">{formatTime(event.at)}</span>
                <span className="tl-when__date">{formatDayShort(event.at)}</span>
              </time>
              <span className="tl-when__title">{event.title}</span>
            </p>
            <div className="tl-body">
              <Section event={event} defaultOpen={openFirst && next} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
