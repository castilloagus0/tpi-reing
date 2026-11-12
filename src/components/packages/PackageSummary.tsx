import { ArrowRight, BedDouble, Plane, ShieldCheck } from "lucide-react";
import { useId } from "react";
import { getDestinationImage } from "../../mocks/media";
import type { TravelPackage } from "../../models";
import { formatCurrency } from "../../utils/formatCurrency";
import { navigate } from "../../utils/navigation";
import { Button } from "../ui/Button";
import { SelectField } from "../ui/Field";
import { SummaryLine } from "./SummaryLine";

interface PackageSummaryProps {
  pkg: TravelPackage;
  total: number;
  onServiceChange: (field: "flightPrice" | "hotelPrice" | "assistancePrice", amount: number) => void;
}

export function PackageSummary({ pkg, total, onServiceChange }: PackageSummaryProps) {
  const image = getDestinationImage(pkg.id);
  const flightId = useId();
  const hotelId = useId();
  return (
    <section className="summary card" aria-labelledby="summary-title">
      <div className="summary__cover">
        <img src={image.thumb} alt="" width={320} height={200} />
        <div>
          <p className="eyebrow">Tu selección</p>
          <h2 id="summary-title" className="summary__title">
            {pkg.destination}, {pkg.country}
          </h2>
        </div>
      </div>

      <div className="summary__lines">
        <SummaryLine icon={<Plane />} label="Vuelos" value={pkg.airline} editable={false} />
        <SummaryLine icon={<BedDouble />} label="Hotel" value={`${pkg.hotel} · ${pkg.mealPlan}`} editable={false} />
        <SummaryLine icon={<ShieldCheck />} label="Asistencia" value="MundoGlobal Plus" editable={false} />
      </div>

      <div className="summary__customize">
        <p className="summary__subtitle">Personalizá tu paquete</p>
        <div className="range-field">
          <label htmlFor={flightId}>
            Vuelo <output>{formatCurrency(pkg.flightPrice)}</output>
          </label>
          <input
            id={flightId}
            className="range"
            type="range"
            min="1100"
            max="1600"
            step="25"
            value={pkg.flightPrice}
            onChange={(event) => onServiceChange("flightPrice", Number(event.target.value))}
          />
        </div>
        <div className="range-field">
          <label htmlFor={hotelId}>
            Hotel <output>{formatCurrency(pkg.hotelPrice)}</output>
          </label>
          <input
            id={hotelId}
            className="range"
            type="range"
            min="800"
            max="1400"
            step="25"
            value={pkg.hotelPrice}
            onChange={(event) => onServiceChange("hotelPrice", Number(event.target.value))}
          />
        </div>
        <SelectField
          label="Plan de asistencia"
          value={pkg.assistancePrice}
          onChange={(event) => onServiceChange("assistancePrice", Number(event.target.value))}
        >
          <option value="90">Esencial — USD 90</option>
          <option value="120">Plus — USD 120</option>
          <option value="180">Total — USD 180</option>
        </SelectField>
      </div>

      <div className="summary__total">
        <span>
          Total estimado
          <small>Incluye impuestos y tasas</small>
        </span>
        <strong>{formatCurrency(total)}</strong>
      </div>
      <Button size="lg" full trailingIcon={<ArrowRight aria-hidden="true" />} onClick={() => navigate("/checkout")}>
        Continuar
      </Button>
    </section>
  );
}
