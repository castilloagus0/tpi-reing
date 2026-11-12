import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { SearchCriteria } from "../../models";
import { useTravel } from "../../services/TravelStore";
import { cx } from "../../utils/cx";
import { navigate } from "../../utils/navigation";
import { isSearchCriteriaValid } from "../../utils/validators";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { DateField, SelectField } from "../ui/Field";

const TRIP_TYPES = ["Paquete completo", "Vuelo + hotel", "Solo vuelo"];

export function TravelSearch({ compact = false }: { compact?: boolean }) {
  const { criteria, setCriteria } = useTravel();
  const [draft, setDraft] = useState(criteria);
  const [error, setError] = useState("");
  const update = (key: keyof SearchCriteria, value: string | number) =>
    setDraft((d) => ({ ...d, [key]: value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!isSearchCriteriaValid(draft)) {
      setError("Elegí origen, destino y fechas válidas para continuar.");
      return;
    }
    setError("");
    setCriteria(draft);
    navigate("/paquetes");
  }

  const datesInvalid = Boolean(error) && !(draft.returnDate > draft.departure);

  return (
    <form
      className={cx("search", compact && "search--compact")}
      onSubmit={submit}
      noValidate
      aria-label="Buscar viaje"
    >
      {!compact && (
        <fieldset className="segmented">
          <legend className="sr-only">Tipo de viaje</legend>
          {TRIP_TYPES.map((type) => (
            <label key={type} className="segmented__option">
              <input
                type="radio"
                name="trip-type"
                value={type}
                checked={draft.type === type}
                onChange={() => update("type", type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </fieldset>
      )}
      <div className="search__fields">
        <SelectField
          label="Origen"
          value={draft.origin}
          onChange={(e) => update("origin", e.target.value)}
        >
          <option>Buenos Aires (EZE)</option>
          <option>Córdoba (COR)</option>
          <option>Santiago (SCL)</option>
        </SelectField>
        <SelectField
          label="Destino"
          value={draft.destination}
          onChange={(e) => update("destination", e.target.value)}
        >
          <option>Cancún (CUN)</option>
          <option>Punta Cana (PUJ)</option>
          <option>París (CDG)</option>
          <option>Nueva York (JFK)</option>
        </SelectField>
        <DateField
          label="Salida"
          value={draft.departure}
          onChange={(e) => update("departure", e.target.value)}
        />
        <DateField
          label="Regreso"
          value={draft.returnDate}
          min={draft.departure}
          error={datesInvalid ? "Debe ser posterior a la salida" : undefined}
          onChange={(e) => update("returnDate", e.target.value)}
        />
        <SelectField
          label="Pasajeros"
          value={`${draft.adults},${draft.children}`}
          onChange={(e) => {
            const [adults, children] = e.target.value.split(",").map(Number);
            setDraft((d) => ({ ...d, adults, children }));
          }}
        >
          <option value="1,0">1 adulto</option>
          <option value="2,0">2 adultos</option>
          <option value="2,1">2 adultos, 1 niño</option>
          <option value="3,0">3 adultos</option>
        </SelectField>
        <Button
          type="submit"
          size="lg"
          className="search__submit"
          leadingIcon={<Search aria-hidden="true" />}
        >
          {compact ? "Actualizar" : "Buscar"}
        </Button>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
    </form>
  );
}
