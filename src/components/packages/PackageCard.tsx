import type { TravelPackage } from "../../models";
import { useTravel } from "../../services/TravelStore";
import { formatCurrency } from "../../utils/formatCurrency";

export function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: TravelPackage;
  selected: boolean;
  onSelect: () => void;
}) {
  const { getTotal } = useTravel();
  return (
    <article className={`package-card ${selected ? "chosen" : ""}`}>
      <div className={`package-photo ${pkg.imageClass}`}>
        <span>{pkg.badge || "Disponible"}</span>
      </div>
      <div className="package-info">
        <h2>
          {pkg.destination}, {pkg.country}
        </h2>
        <p>{pkg.subtitle}</p>
        <ul>
          <li>
            ✈ <b>Vuelo ida y vuelta</b>
            <small>{pkg.airline}</small>
          </li>
          <li>
            ▦ <b>{pkg.hotel}</b>
            <small>
              {"★".repeat(pkg.stars)} · {pkg.mealPlan}
            </small>
          </li>
          <li>
            ⬟ <b>Asistencia al viajero</b>
            <small>MundoGlobal Plus · Cobertura internacional</small>
          </li>
        </ul>
      </div>
      <div className="package-price">
        <p>
          ♟ {pkg.nights} noches &nbsp; ▦ Hotel &nbsp; ✈ Vuelos &nbsp; ▱
          Traslados
        </p>
        <span>Desde</span>
        <b>{formatCurrency(Math.round(getTotal(pkg) / 2))}</b>
        <small>por persona</small>
        <button
          className={selected ? "secondary full" : "primary full"}
          onClick={onSelect}
        >
          {selected ? "Paquete seleccionado ✓" : "Ver paquete →"}
        </button>
        <button className="link">Ver detalles del paquete⌄</button>
      </div>
    </article>
  );
}
