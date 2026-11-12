import { QRCodeSVG } from "qrcode.react";
import type { FlightEvent } from "../../mocks/tripDetails";
import { formatTime } from "../../utils/formatDate";

export function BoardingPass({ flight }: { flight: FlightEvent }) {
  const fields: Array<[string, string]> = [
    ["Terminal", flight.from.terminal ?? "—"],
    ["Puerta", flight.gate],
    ["Asiento", flight.seat],
    ["Embarque", formatTime(flight.boardingTime)],
    ["Grupo", flight.boardingGroup],
    ["Clase", flight.cabin],
  ];

  return (
    <div className="bpass">
      <div className="bpass__main">
        <p className="eyebrow">Pase de embarque</p>
        <p className="bpass__passenger">{flight.passenger}</p>
        <dl className="bpass__grid">
          {fields.map(([label, value]) => (
            <div key={label} className="bpass__field">
              <dt>{label}</dt>
              <dd className="mono">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="bpass__tear" aria-hidden="true" />
      <figure className="bpass__qr">
        <div className="bpass__qr-frame">
          <QRCodeSVG
            value={flight.boardingCode}
            size={200}
            level="M"
            marginSize={0}
            fgColor="currentColor"
            bgColor="transparent"
            title={`Código QR de embarque del vuelo ${flight.flightNumber}`}
          />
        </div>
        <figcaption>
          <span className="mono">{flight.flightNumber.replace(" ", "")} · {flight.seat}</span>
          Mostralo en el control de seguridad y en la puerta.
        </figcaption>
      </figure>
    </div>
  );
}
