import { ArrowRight, Check, Copy, Phone } from "lucide-react";
import { useClipboard } from "../../../hooks/useClipboard";
import type { TransferEvent } from "../../../mocks/tripDetails";
import { formatTime } from "../../../utils/formatDate";
import { Avatar } from "../../ui/Avatar";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { TimelineSection } from "../TimelineSection";

export function TransferSection({
  event,
  defaultOpen,
}: {
  event: TransferEvent;
  defaultOpen?: boolean;
}) {
  const { copy, copied } = useClipboard();

  const summary = (
    <>
      <span className="tsec__meta">
        <span className="tsec__provider">
          {event.provider} · Retiro {formatTime(event.at)}
        </span>
        <Badge tone="success" dot>
          Confirmado
        </Badge>
      </span>
      <span className="transfer-route">
        <span>{event.from}</span>
        <ArrowRight aria-hidden="true" />
        <span>{event.to}</span>
      </span>
    </>
  );

  return (
    <TimelineSection
      label={`${event.title}: de ${event.from} a ${event.to} a las ${formatTime(event.at)}. Ver detalles del traslado`}
      summary={summary}
      defaultOpen={defaultOpen}
    >
      <dl className="facts transfer-facts">
        <div className="transfer-facts__wide">
          <dt>Punto de encuentro</dt>
          <dd>{event.meetingPoint}</dd>
        </div>
        <div>
          <dt>Vehículo</dt>
          <dd>{event.vehicle}</dd>
        </div>
        <div>
          <dt>Duración estimada</dt>
          <dd>{event.durationMinutes} min</dd>
        </div>
        <div>
          <dt>Pasajeros</dt>
          <dd>{event.passengers}</dd>
        </div>
      </dl>

      <div className="driver">
        <Avatar name={event.driver.name} />
        <div className="driver__text">
          <span className="driver__name">{event.driver.name}</span>
          <span className="driver__role">Tu chofer</span>
        </div>
        <a className="btn btn--secondary btn--sm" href={`tel:${event.driver.phone.replace(/\s/g, "")}`}>
          <Phone aria-hidden="true" />
          Llamar
        </a>
      </div>

      <div className="code-box">
        <div>
          <p className="code-box__label">Voucher del traslado</p>
          <p className="code-box__value mono">{event.voucher}</p>
        </div>
        <Button
          variant={copied ? "secondary" : "ink"}
          size="sm"
          className={copied ? "is-copied" : undefined}
          onClick={() => copy(event.voucher)}
          leadingIcon={copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          aria-label="Copiar voucher del traslado"
        >
          {copied ? "Copiado" : "Copiar"}
        </Button>
        <span className="sr-only" aria-live="polite">
          {copied ? "Voucher copiado al portapapeles" : ""}
        </span>
      </div>
    </TimelineSection>
  );
}
