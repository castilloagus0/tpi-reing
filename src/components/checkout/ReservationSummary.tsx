import type { TravelPackage } from "../../models";
import { useTravel } from "../../services/TravelStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { SummaryLine } from "../packages/SummaryLine";

export function ReservationSummary({
  package: pkg,
  total,
}: {
  package: TravelPackage;
  total: number;
}) {
  const { criteria } = useTravel();
  return (
    <aside className="reservation-summary">
      <h2>
        Tu reserva <button className="link">✎ Editar</button>
      </h2>
      <div className={`summary-cover ${pkg.imageClass}`}>
        <h3>
          {pkg.destination}, {pkg.country}
        </h3>
        <p>
          {pkg.nights} días · {pkg.mealPlan}
        </p>
      </div>
      <SummaryLine
        icon="✈"
        label="Vuelos"
        value={`${criteria.origin} → ${criteria.destination}`}
      />
      <SummaryLine
        icon="▦"
        label="Hotel"
        value={`${pkg.hotel} · ${pkg.nights} noches`}
      />
      <SummaryLine
        icon="⬟"
        label="Asistencia en viaje"
        value="MundoGlobal Travel Assist · Cobertura completa"
      />
      <div className="price-breakdown">
        <h2>Detalle de precios</h2>
        <p>
          <span>Vuelos (2 adultos)</span>
          <b>{formatCurrency(pkg.flightPrice)}</b>
        </p>
        <p>
          <span>Hotel ({pkg.nights} noches)</span>
          <b>{formatCurrency(pkg.hotelPrice)}</b>
        </p>
        <p>
          <span>Asistencia en viaje</span>
          <b>{formatCurrency(pkg.assistancePrice)}</b>
        </p>
        <p>
          <span>Impuestos y tasas</span>
          <b>USD 210</b>
        </p>
        <div>
          <span>
            Total a pagar<small>Incluye todos los impuestos y tasas</small>
          </span>
          <b>{formatCurrency(total)}</b>
        </div>
      </div>
      <div className="safe-strip">
        <span>● Pago seguro</span>
        <span>● Confirmación inmediata</span>
      </div>
    </aside>
  );
}
