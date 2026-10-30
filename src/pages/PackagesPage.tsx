import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { PageBanner } from "../components/layout/PageBanner";
import { PackageFilters } from "../components/packages/PackageFilters";
import { PackageList } from "../components/packages/PackageList";
import { PackageSummary } from "../components/packages/PackageSummary";
import { TravelSearch } from "../components/search/TravelSearch";
import { getAvailablePackages } from "../services/package.service";
import { useTravel } from "../services/TravelStore";

export function PackagesPage() {
  const { selectedPackage, selectPackage, getTotal } = useTravel();
  const [maxPrice, setMaxPrice] = useState(4000);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [meals, setMeals] = useState<string[]>([]);

  const filteredPackages = getAvailablePackages().filter(
    (pkg) =>
      getTotal(pkg) <= maxPrice &&
      (!airlines.length || airlines.includes(pkg.airline)) &&
      (!meals.length || meals.includes(pkg.mealPlan)),
  );

  const updateService = (
    field: "flightPrice" | "hotelPrice" | "assistancePrice",
    amount: number,
  ) => selectPackage({ ...selectedPackage, [field]: amount });

  return (
    <>
      <PageBanner
        title="Encuentra tu paquete ideal"
        subtitle="Compara, personaliza y combina vuelo + hotel todo incluido + asistencia."
        crumb="PAQUETES Y VUELOS"
        image
      />
      <main className="packages-page">
        <TravelSearch compact />
        <div className="package-layout">
          <PackageFilters
            maxPrice={maxPrice}
            airlines={airlines}
            meals={meals}
            onMaxPriceChange={setMaxPrice}
            onAirlinesChange={setAirlines}
            onMealsChange={setMeals}
            onReset={() => {
              setMaxPrice(4000);
              setAirlines([]);
              setMeals([]);
            }}
          />
          <PackageList
            packages={filteredPackages}
            selectedPackageId={selectedPackage.id}
            onSelect={selectPackage}
          />
          <PackageSummary
            pkg={selectedPackage}
            total={getTotal()}
            onServiceChange={updateService}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
