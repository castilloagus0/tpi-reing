import { navigate } from "../../utils/navigation";
import { Icon } from "../ui/Icon";

export function TripSide() {
  return (
    <aside className="trip-side">
      <section className="quick-actions">
        <h2>Acciones rápidas</h2>
        {[
          "Ver itinerario completo",
          "Descargar voucher(s)",
          "Solicitar cambio",
          "Contactar soporte 24/7",
        ].map((action) => (
          <button key={action}>
            <Icon>
              {action.includes("voucher")
                ? "▤"
                : action.includes("cambio")
                  ? "↔"
                  : action.includes("soporte")
                    ? "♧"
                    : "☷"}
            </Icon>
            {action}
            <b>›</b>
          </button>
        ))}
      </section>
      <section className="documents">
        <h2>
          Documentos de viaje{" "}
          <button className="text-button">Ver todos →</button>
        </h2>
        {[
          "Voucher de vuelo",
          "Voucher de hotel",
          "Itinerario completo",
          "Póliza de asistencia",
        ].map((name) => (
          <button key={name}>
            <Icon>▤</Icon>
            <span>
              <b>{name}</b>
              <small>PDF · 245 KB</small>
            </span>
            <b>⇩</b>
          </button>
        ))}
      </section>
      <section className="assist-card">
        <b>
          ⬟ Asistencia al viajero <em>● Activa</em>
        </b>
        <p>
          Tu asistencia MundoGlobal Travel
          <br />
          Cobertura internacional incluida en tu paquete.
        </p>
        <button onClick={() => navigate("/asistencia")}>Ver cobertura</button>
        <button
          className="primary small"
          onClick={() => navigate("/asistencia")}
        >
          Contactar asistencia
        </button>
      </section>
    </aside>
  );
}
