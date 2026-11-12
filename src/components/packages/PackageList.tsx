import { SearchX } from "lucide-react";
import type { TravelPackage } from "../../models";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { PackageCard } from "./PackageCard";

interface PackageListProps {
  packages: TravelPackage[];
  selectedPackageId: string;
  onSelect: (pkg: TravelPackage) => void;
  onReset: () => void;
}

export function PackageList({ packages, selectedPackageId, onSelect, onReset }: PackageListProps) {
  if (!packages.length) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="No hay paquetes con estos filtros"
        text="Probá ampliar el precio o quitar algún filtro."
        action={
          <Button variant="secondary" onClick={onReset}>
            Limpiar filtros
          </Button>
        }
      />
    );
  }
  return (
    <ul className="pkg-list">
      {packages.map((pkg) => (
        <li key={pkg.id}>
          <PackageCard pkg={pkg} selected={selectedPackageId === pkg.id} onSelect={() => onSelect(pkg)} />
        </li>
      ))}
    </ul>
  );
}
