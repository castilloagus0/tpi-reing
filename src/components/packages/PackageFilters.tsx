import { Stars } from "../ui/Stars";

export interface FilterOption<T extends string | number> {
  value: T;
  count: number;
}

interface PackageFiltersProps {
  idPrefix: string;
  maxPrice: number;
  priceBounds: [number, number];
  airlines: string[];
  meals: string[];
  stars: number[];
  airlineOptions: FilterOption<string>[];
  mealOptions: FilterOption<string>[];
  starOptions: FilterOption<number>[];
  onMaxPriceChange: (value: number) => void;
  onAirlinesChange: (value: string[]) => void;
  onMealsChange: (value: string[]) => void;
  onStarsChange: (value: number[]) => void;
  onReset: () => void;
}

function toggle<T>(value: T, values: T[]): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

const price = (n: number) => `USD ${n.toLocaleString("es-AR")}`;

export function PackageFilters({
  idPrefix,
  maxPrice,
  priceBounds,
  airlines,
  meals,
  stars,
  airlineOptions,
  mealOptions,
  starOptions,
  onMaxPriceChange,
  onAirlinesChange,
  onMealsChange,
  onStarsChange,
  onReset,
}: PackageFiltersProps) {
  const active = airlines.length + meals.length + stars.length + (maxPrice < priceBounds[1] ? 1 : 0);
  return (
    <div className="filters">
      <div className="filters__head">
        <h2 className="filters__title">Filtros</h2>
        <button type="button" className="btn btn--link btn--sm" onClick={onReset} disabled={!active}>
          Limpiar{active ? ` (${active})` : ""}
        </button>
      </div>

      <fieldset className="filters__group">
        <legend>Precio total</legend>
        <label className="filters__range" htmlFor={`${idPrefix}-price`}>
          <span>Hasta</span>
          <output htmlFor={`${idPrefix}-price`}>
            {price(maxPrice)}
          </output>
        </label>
        <input
          id={`${idPrefix}-price`}
          className="range"
          type="range"
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={100}
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
        />
        <div className="filters__range-scale" aria-hidden="true">
          <span>{price(priceBounds[0])}</span>
          <span>{price(priceBounds[1])}</span>
        </div>
      </fieldset>

      <fieldset className="filters__group">
        <legend>Aerolínea</legend>
        {airlineOptions.map(({ value, count }) => (
          <label key={value} className="check-row">
            <input
              type="checkbox"
              checked={airlines.includes(value)}
              onChange={() => onAirlinesChange(toggle(value, airlines))}
            />
            <span>{value}</span>
            <span className="check-row__count">{count}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="filters__group">
        <legend>Categoría de hotel</legend>
        {starOptions.map(({ value, count }) => (
          <label key={value} className="check-row">
            <input
              type="checkbox"
              checked={stars.includes(value)}
              onChange={() => onStarsChange(toggle(value, stars))}
            />
            <Stars count={value} />
            <span className="check-row__count">{count}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="filters__group">
        <legend>Régimen de comidas</legend>
        {mealOptions.map(({ value, count }) => (
          <label key={value} className="check-row">
            <input
              type="checkbox"
              checked={meals.includes(value)}
              onChange={() => onMealsChange(toggle(value, meals))}
            />
            <span>{value}</span>
            <span className="check-row__count">{count}</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
