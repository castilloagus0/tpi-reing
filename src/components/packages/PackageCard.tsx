import { BedDouble, Check, Moon, Plane, ShieldCheck, UtensilsCrossed } from "lucide-react";
import { getDestinationImage } from "../../mocks/media";
import type { TravelPackage } from "../../models";
import { useTravel } from "../../services/TravelStore";
import { cx } from "../../utils/cx";
import { formatCurrency } from "../../utils/formatCurrency";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Stars } from "../ui/Stars";

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
  const image = getDestinationImage(pkg.id);
  const titleId = `pkg-${pkg.id}`;
  return (
    <article className={cx("pkg-card", selected && "pkg-card--selected")} aria-labelledby={titleId}>
      <div className="pkg-card__media">
        <img src={image.medium} alt={image.alt} loading="lazy" width={720} height={480} />
        {pkg.badge && (
          <Badge tone="glass" className="pkg-card__badge">
            {pkg.badge}
          </Badge>
        )}
      </div>
      <div className="pkg-card__body">
        <div className="pkg-card__head">
          <h3 id={titleId} className="pkg-card__title">
            {pkg.destination}
            <span>{pkg.country}</span>
          </h3>
          <p className="pkg-card__subtitle">{pkg.subtitle}</p>
        </div>
        <ul className="pkg-card__features">
          <li>
            <Plane aria-hidden="true" />
            {pkg.airline}
          </li>
          <li>
            <BedDouble aria-hidden="true" />
            <span>
              {pkg.hotel} <Stars count={pkg.stars} />
            </span>
          </li>
          <li>
            <UtensilsCrossed aria-hidden="true" />
            {pkg.mealPlan}
          </li>
          <li>
            <Moon aria-hidden="true" />
            {pkg.nights} noches
          </li>
          <li>
            <ShieldCheck aria-hidden="true" />
            Asistencia al viajero
          </li>
        </ul>
      </div>
      <div className="pkg-card__price">
        <p>
          <span className="pkg-card__from">Desde</span>
          <strong className="pkg-card__amount">{formatCurrency(Math.round(getTotal(pkg) / 2))}</strong>
          <span className="pkg-card__per">por persona · {formatCurrency(getTotal(pkg))} total</span>
        </p>
        <Button
          variant={selected ? "secondary" : "primary"}
          full
          aria-pressed={selected}
          leadingIcon={selected ? <Check aria-hidden="true" /> : undefined}
          onClick={onSelect}
        >
          {selected ? "Seleccionado" : "Elegir paquete"}
        </Button>
      </div>
    </article>
  );
}
