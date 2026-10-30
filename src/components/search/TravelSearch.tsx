import { useState, type FormEvent } from "react";
import type { SearchCriteria } from "../../models";
import { useTravel } from "../../services/TravelStore";
import { navigate } from "../../utils/navigation";
import { isSearchCriteriaValid } from "../../utils/validators";
import { Icon } from "../ui/Icon";
import { SearchField as Field } from "../ui/SearchField";

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
    setCriteria(draft);
    navigate("/paquetes");
  }
  return (
    <form
      className={`search-card ${compact ? "compact" : ""}`}
      onSubmit={submit}
      noValidate
    >
      {!compact && (
        <div className="search-tabs">
          <button type="button" className="selected">
            <Icon>✈</Icon> Paquetes y vuelos
          </button>
          <button type="button">
            <Icon>▦</Icon> Hoteles
          </button>
          <button type="button">
            <Icon>☂</Icon> Paquetes todo incluido
          </button>
          <button type="button">
            <Icon>⬟</Icon> Asistencia en viaje
          </button>
        </div>
      )}
      <div className="search-controls">
        <Field label="Origen" icon="⌖">
          <select
            value={draft.origin}
            onChange={(e) => update("origin", e.target.value)}
          >
            <option>Buenos Aires (EZE)</option>
            <option>Córdoba (COR)</option>
            <option>Santiago (SCL)</option>
          </select>
        </Field>
        <Field label="Destino" icon="⌖">
          <select
            value={draft.destination}
            onChange={(e) => update("destination", e.target.value)}
          >
            <option>Cancún (CUN)</option>
            <option>Punta Cana (PUJ)</option>
            <option>París (CDG)</option>
            <option>Nueva York (JFK)</option>
          </select>
        </Field>
        <Field label="Fechas" icon="▣" className="date-field">
          <span className="date-pair">
            <input
              aria-label="Fecha de salida"
              type="date"
              value={draft.departure}
              onChange={(e) => update("departure", e.target.value)}
            />
            <input
              aria-label="Fecha de regreso"
              type="date"
              value={draft.returnDate}
              onChange={(e) => update("returnDate", e.target.value)}
            />
          </span>
        </Field>
        <Field label="Pasajeros" icon="♙">
          <select
            value={`${draft.adults},${draft.children}`}
            onChange={(e) => {
              const [adults, children] = e.target.value.split(",").map(Number);
              update("adults", adults);
              update("children", children);
            }}
          >
            <option value="2,0">2 adultos, 0 niños</option>
            <option value="1,0">1 adulto</option>
            <option value="2,1">2 adultos, 1 niño</option>
            <option value="3,0">3 adultos</option>
          </select>
        </Field>
        {!compact && (
          <Field label="Tipo de viaje" icon="▣">
            <select
              value={draft.type}
              onChange={(e) => update("type", e.target.value)}
            >
              <option>Paquete completo</option>
              <option>Solo vuelo</option>
              <option>Vuelo + hotel</option>
            </select>
          </Field>
        )}
        <button className="primary quote" type="submit">
          {compact ? "Modificar búsqueda" : "Cotizar ahora"} <b>→</b>
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
