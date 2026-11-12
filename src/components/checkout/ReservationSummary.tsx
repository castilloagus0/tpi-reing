import { BedDouble, Plane, ShieldCheck } from "lucide-react";
import { getDestinationImage } from "../../mocks/media";
import type { TravelPackage } from "../../models";
import { useTravel } from "../../services/TravelStore";
import { PACKAGE_TAXES } from "../../utils/calculatePackagePrice";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { SummaryLine } from "../packages/SummaryLine";

export function ReservationSummary({ package: pkg, total }: { package: TravelPackage; total: number }) {
  const { criteria } = useTravel();
  const image = getDestinationImage(pkg.id);
  const rows: Array<[string, number]> = [
    [`Vuelos (${criteria.adults} ${criteria.adults === 1 ? "adulto" : "adultos"})`, pkg.flightPrice],
    [`Hotel (${pkg.nights} noches)`, pkg.hotelPrice],
    ["Asistencia en viaje", pkg.assistancePrice],
    ["Impuestos y tasas", PACKAGE_TAXES],
  ];
  return (
    <aside className="summary card" aria-labelledby="reservation-title">
      <div className="summary__cover">
        <img src={image.thumb} alt="" width={320} height={200} />
        <div>
          <p className="eyebrow">Tu reserva</p>
          <h2 id="reservation-title" className="summary__title">
            {pkg.destination}, {pkg.country}
          </h2>
          <p className="summary__dates">
            {formatDate(criteria.departure)} – {formatDate(criteria.returnDate)}
          </p>
        </div>
      </div>
      <div className="summary__lines">
        <SummaryLine icon={<Plane />} label="Vuelos" value={`${criteria.origin} → ${criteria.destination}`} />
        <SummaryLine icon={<BedDouble />} label="Hotel" value={`${pkg.hotel} · ${pkg.mealPlan}`} />
        <SummaryLine icon={<ShieldCheck />} label="Asistencia" value="MundoGlobal Plus" />
      </div>
      <dl className="price-rows">
        {rows.map(([label, amount]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{formatCurrency(amount)}</dd>
          </div>
        ))}
      </dl>
      <div className="summary__total">
        <span>
          Total a pagar
          <small>Incluye impuestos y tasas</small>
        </span>
        <strong>{formatCurrency(total)}</strong>
      </div>
    </aside>
  );
}
