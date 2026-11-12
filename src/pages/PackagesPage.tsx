import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Footer } from "../components/layout/Footer";
import { PageHeader } from "../components/layout/PageHeader";
import { PackageFilters, type FilterOption } from "../components/packages/PackageFilters";
import { PackageList } from "../components/packages/PackageList";
import { PackageSummary } from "../components/packages/PackageSummary";
import { TravelSearch } from "../components/search/TravelSearch";
import { Button } from "../components/ui/Button";
import { Drawer } from "../components/ui/Dialog";
import { Skeleton } from "../components/ui/Skeleton";
import { useSimulatedLoading } from "../hooks/useSimulatedLoading";
import type { TravelPackage } from "../models";
import { getAvailablePackages } from "../services/package.service";
import { useTravel } from "../services/TravelStore";

const PRICE_BOUNDS: [number, number] = [1200, 4000];

type Sort = "recommended" | "price-asc" | "price-desc";

function countBy<T extends string | number>(items: TravelPackage[], pick: (p: TravelPackage) => T) {
  const counts = new Map<T, number>();
  items.forEach((item) => counts.set(pick(item), (counts.get(pick(item)) ?? 0) + 1));
  return [...counts.entries()].map(([value, count]) => ({ value, count })) as FilterOption<T>[];
}

export function PackagesPage() {
  const { selectedPackage, selectPackage, getTotal } = useTravel();
  const loading = useSimulatedLoading();
  const [maxPrice, setMaxPrice] = useState(PRICE_BOUNDS[1]);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [meals, setMeals] = useState<string[]>([]);
  const [stars, setStars] = useState<number[]>([]);
  const [sort, setSort] = useState<Sort>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const all = getAvailablePackages();
  const options = useMemo(
    () => ({
      airlineOptions: countBy(all, (p) => p.airline),
      mealOptions: countBy(all, (p) => p.mealPlan),
      starOptions: countBy(all, (p) => p.stars).sort((a, b) => b.value - a.value),
    }),
    [all],
  );

  const filteredPackages = all
    .filter(
      (pkg) =>
        getTotal(pkg) <= maxPrice &&
        (!airlines.length || airlines.includes(pkg.airline)) &&
        (!meals.length || meals.includes(pkg.mealPlan)) &&
        (!stars.length || stars.includes(pkg.stars)),
    )
    .sort((a, b) =>
      sort === "price-asc"
        ? getTotal(a) - getTotal(b)
        : sort === "price-desc"
          ? getTotal(b) - getTotal(a)
          : 0,
    );

  const reset = () => {
    setMaxPrice(PRICE_BOUNDS[1]);
    setAirlines([]);
    setMeals([]);
    setStars([]);
  };

  const updateService = (field: "flightPrice" | "hotelPrice" | "assistancePrice", amount: number) =>
    selectPackage({ ...selectedPackage, [field]: amount });

  const filterProps = {
    maxPrice,
    priceBounds: PRICE_BOUNDS,
    airlines,
    meals,
    stars,
    ...options,
    onMaxPriceChange: setMaxPrice,
    onAirlinesChange: setAirlines,
    onMealsChange: setMeals,
    onStarsChange: setStars,
    onReset: reset,
  };
  const activeFilters = airlines.length + meals.length + stars.length + (maxPrice < PRICE_BOUNDS[1] ? 1 : 0);

  return (
    <>
      <main id="main" className="page packages" tabIndex={-1}>
        <PageHeader
          eyebrow="Paquetes"
          title="Encontrá tu paquete ideal"
          subtitle="Compará y combiná vuelo, hotel y asistencia en una sola reserva."
        />
        <div className="container">
          <TravelSearch compact />
          <div className="packages__layout">
            <aside className="packages__filters" aria-label="Filtros">
              <PackageFilters idPrefix="inline" {...filterProps} />
            </aside>

            <section className="packages__results" aria-labelledby="results-title" aria-busy={loading}>
              <div className="results-bar">
                <h2 id="results-title" className="results-bar__title" aria-live="polite">
                  {loading ? "Buscando paquetes…" : `${filteredPackages.length} paquetes`}
                </h2>
                <div className="results-bar__actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="packages__filters-trigger"
                    leadingIcon={<SlidersHorizontal aria-hidden="true" />}
                    onClick={() => setFiltersOpen(true)}
                  >
                    Filtros{activeFilters ? ` (${activeFilters})` : ""}
                  </Button>
                  <label className="sr-only" htmlFor="sort">
                    Ordenar por
                  </label>
                  <select
                    id="sort"
                    className="control control--sm"
                    value={sort}
                    onChange={(event) => setSort(event.target.value as Sort)}
                  >
                    <option value="recommended">Recomendados</option>
                    <option value="price-asc">Menor precio</option>
                    <option value="price-desc">Mayor precio</option>
                  </select>
                </div>
              </div>
              {loading ? (
                <ul className="pkg-list" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <li key={i} className="pkg-card pkg-card--skeleton">
                      <Skeleton shape="media" className="pkg-card__media" />
                      <div className="pkg-card__body">
                        <Skeleton shape="title" />
                        <Skeleton />
                        <Skeleton className="trip-skeleton__short" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <PackageList
                  packages={filteredPackages}
                  selectedPackageId={selectedPackage.id}
                  onSelect={selectPackage}
                  onReset={reset}
                />
              )}
            </section>

            <div className="packages__summary">
              <PackageSummary pkg={selectedPackage} total={getTotal()} onServiceChange={updateService} />
            </div>
          </div>
        </div>
        <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filtros">
          <PackageFilters idPrefix="drawer" {...filterProps} />
          <Button full className="filters__apply" onClick={() => setFiltersOpen(false)}>
            Ver {filteredPackages.length} paquetes
          </Button>
        </Drawer>
      </main>
      <Footer />
    </>
  );
}
