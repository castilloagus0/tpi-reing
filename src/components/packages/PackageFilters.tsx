import { Checkbox } from "../ui/Checkbox";

interface PackageFiltersProps {
  maxPrice: number;
  airlines: string[];
  meals: string[];
  onMaxPriceChange: (value: number) => void;
  onAirlinesChange: (value: string[]) => void;
  onMealsChange: (value: string[]) => void;
  onReset: () => void;
}

function toggle(value: string, values: string[]): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function PackageFilters({
  maxPrice,
  airlines,
  meals,
  onMaxPriceChange,
  onAirlinesChange,
  onMealsChange,
  onReset,
}: PackageFiltersProps) {
  return (
    <aside className="filters">
      <div className="filter-title">
        <h3>Filtrar resultados</h3>
        <button onClick={onReset}>Limpiar filtros</button>
      </div>
      <section>
        <b>Precio total del paquete</b>
        <p>USD 600 – USD {maxPrice.toLocaleString("es-AR")}</p>
        <input
          aria-label="Precio máximo"
          type="range"
          min="1200"
          max="4000"
          step="100"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
        />
        <div className="range-label">
          <span>USD 600</span>
          <span>USD 4.000</span>
        </div>
      </section>
      <section>
        <b>Aerolínea</b>
        {[
          "Aerolíneas Argentinas",
          "LATAM Airlines",
          "Copa Airlines",
          "Avianca",
        ].map((name, index) => (
          <Checkbox
            key={name}
            label={name}
            count={[12, 10, 6, 4][index]}
            checked={airlines.includes(name)}
            onChange={() => onAirlinesChange(toggle(name, airlines))}
          />
        ))}
      </section>
      <section>
        <b>Categoría de hotel</b>
        <Checkbox
          label="5 estrellas"
          count={18}
          checked={false}
          onChange={() => undefined}
        />
        <Checkbox
          label="4 estrellas"
          count={24}
          checked={false}
          onChange={() => undefined}
        />
      </section>
      <section>
        <b>Régimen de comidas</b>
        {["Todo incluido", "Media pensión", "Desayuno incluido"].map(
          (name, index) => (
            <Checkbox
              key={name}
              label={name}
              count={[28, 10, 6][index]}
              checked={meals.includes(name)}
              onChange={() => onMealsChange(toggle(name, meals))}
            />
          ),
        )}
      </section>
    </aside>
  );
}
