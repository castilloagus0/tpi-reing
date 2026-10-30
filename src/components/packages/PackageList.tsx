import type { TravelPackage } from "../../models";
import { PackageCard } from "./PackageCard";

interface PackageListProps {
  packages: TravelPackage[];
  selectedPackageId: string;
  onSelect: (pkg: TravelPackage) => void;
}

export function PackageList({
  packages,
  selectedPackageId,
  onSelect,
}: PackageListProps) {
  return (
    <section className="package-results">
      <div className="result-tabs">
        <button className="active">▣ Paquetes completos</button>
        <button>✈ Vuelo</button>
        <button>▦ Hotel</button>
        <button>⬟ Asistencia</button>
        <span>{packages.length} opciones</span>
      </div>
      {packages.length ? (
        packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            selected={selectedPackageId === pkg.id}
            onSelect={() => onSelect(pkg)}
          />
        ))
      ) : (
        <div className="empty-state">
          No hay paquetes para estos filtros. Probá ampliar el rango o quitar
          algún filtro.
        </div>
      )}
    </section>
  );
}
