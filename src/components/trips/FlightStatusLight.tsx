import { statusLabel, type FlightStatus } from "../../hooks/useFlightStatus";
import { cx } from "../../utils/cx";
import { formatTime } from "../../utils/formatDate";

function delayedTime(departure: string, minutes: number) {
  const date = new Date(departure);
  date.setMinutes(date.getMinutes() + minutes);
  return formatTime(date);
}

/** Semáforo compacto para la cabecera colapsada. */
export function FlightStatusPill({ status }: { status: FlightStatus }) {
  return (
    <span className={cx("status-pill", `status-pill--${status.kind}`)}>
      <span className="status-pill__light" aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}

/** Semáforo completo con indicador "en vivo" para la vista expandida. */
export function FlightStatusLight({
  status,
  departure,
}: {
  status: FlightStatus;
  departure: string;
}) {
  const onTime = status.kind === "on-time";
  return (
    <div className={cx("semaphore", `semaphore--${status.kind}`)}>
      <div className="semaphore__housing" aria-hidden="true">
        <span className={cx("semaphore__lamp semaphore__lamp--red", !onTime && "is-on")} />
        <span className={cx("semaphore__lamp semaphore__lamp--green", onTime && "is-on")} />
      </div>
      <div className="semaphore__text">
        <p className="semaphore__live">
          <span className="live-dot" aria-hidden="true" />
          En vivo · actualizado {formatTime(status.updatedAt)}
        </p>
        <p className="semaphore__label">{statusLabel(status)}</p>
        <p className="semaphore__detail">
          {onTime
            ? `Salida prevista ${formatTime(departure)}`
            : `Nueva salida estimada ${delayedTime(departure, status.delayMinutes)}`}
        </p>
      </div>
    </div>
  );
}
