import type { TravelPackage } from "../../models";
import { formatCurrency } from "../../utils/formatCurrency";
import { navigate } from "../../utils/navigation";
import { SummaryLine } from "./SummaryLine";

interface PackageSummaryProps {
  pkg: TravelPackage;
  total: number;
  onServiceChange: (
    field: "flightPrice" | "hotelPrice" | "assistancePrice",
    amount: number,
  ) => void;
}

export function PackageSummary({
  pkg,
  total,
  onServiceChange,
}: PackageSummaryProps) {
  return (
    <aside className="package-summary">
      <h3>Tu paquete seleccionado</h3>
      <button className="change" onClick={() => navigate("/paquetes")}>
        Cambiar →
      </button>
      <div className={`summary-cover ${pkg.imageClass}`}>
        <span>Paquete seleccionado</span>
        <h3>
          {pkg.destination}, {pkg.country}
        </h3>
      </div>
      <SummaryLine icon="✈" label="Vuelos" value={pkg.airline} />
      <SummaryLine
        icon="▦"
        label="Hotel"
        value={`${pkg.hotel} · ${pkg.mealPlan}`}
      />
      <SummaryLine
        icon="⬟"
        label="Asistencia al viajero"
        value="MundoGlobal Plus · Cobertura internacional"
      />
      <div className="service-customize">
        <label>
          Vuelo
          <input
            aria-label="Precio del vuelo"
            type="range"
            min="1100"
            max="1600"
            step="25"
            value={pkg.flightPrice}
            onChange={(event) =>
              onServiceChange("flightPrice", Number(event.target.value))
            }
          />
          <b>{formatCurrency(pkg.flightPrice)}</b>
        </label>
        <label>
          Hotel
          <input
            aria-label="Precio del hotel"
            type="range"
            min="800"
            max="1400"
            step="25"
            value={pkg.hotelPrice}
            onChange={(event) =>
              onServiceChange("hotelPrice", Number(event.target.value))
            }
          />
          <b>{formatCurrency(pkg.hotelPrice)}</b>
        </label>
        <label>
          Asistencia
          <select
            value={pkg.assistancePrice}
            onChange={(event) =>
              onServiceChange("assistancePrice", Number(event.target.value))
            }
          >
            <option value="90">Esencial — USD 90</option>
            <option value="120">Plus — USD 120</option>
            <option value="180">Total — USD 180</option>
          </select>
        </label>
      </div>
      <div className="total-box">
        <span>
          Total estimado<small>Incluye impuestos y tasas</small>
        </span>
        <b>{formatCurrency(total)}</b>
      </div>
      <button className="primary full" onClick={() => navigate("/checkout")}>
        Continuar y personalizar&nbsp; →
      </button>
    </aside>
  );
}
