import { Icon } from "../ui/Icon";

export function Notifications() {
  return (
    <section className="panel notifications">
      <h2>
        ♟ Alertas y notificaciones{" "}
        <button className="text-button">Ver todas →</button>
      </h2>
      {[
        [
          "✈",
          "Check-in disponible",
          "Ya podés hacer el check-in de tu vuelo.",
        ],
        [
          "i",
          "Requisito de ingreso",
          "Verificá la documentación antes de viajar.",
        ],
        [
          "!",
          "Documentación importante",
          "No olvides llevar tu póliza de asistencia.",
        ],
      ].map(([icon, title, body]) => (
        <article key={title}>
          <Icon>{icon}</Icon>
          <div>
            <b>{title}</b>
            <p>{body}</p>
          </div>
          <small>Hace 2 días</small>
        </article>
      ))}
    </section>
  );
}
