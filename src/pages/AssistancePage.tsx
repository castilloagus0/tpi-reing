import { useState, type FormEvent } from "react";
import { PageBanner } from "../components/layout/PageBanner";
import { Footer } from "../components/layout/Footer";
import { Icon } from "../components/ui/Icon";
import { useTravel } from "../services/TravelStore";

export function AssistancePage() {
  const { bookings, claims, createClaim } = useTravel();
  const [query, setQuery] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [bookingId, setBookingId] = useState(bookings[0]?.id || "");
  const [chat, setChat] = useState<string[]>([
    "Hola, Laura. Soy el asistente virtual de MundoGlobal. ¿En qué podemos ayudarte?",
  ]);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const faqs = [
    [
      "¿Cómo descargo mis vouchers?",
      "Ingresá a Mis viajes, abrí tu reserva y seleccioná el documento que necesitás.",
    ],
    [
      "¿Cómo solicito un cambio?",
      "Podés iniciar la solicitud desde Mis viajes o completando el formulario de esta página.",
    ],
    [
      "¿Qué cubre mi asistencia?",
      "Tu plan incluye atención 24/7 y cobertura internacional según la póliza contratada.",
    ],
    [
      "¿Cómo hago el check-in?",
      "Te avisaremos cuando el check-in esté habilitado para tu vuelo.",
    ],
  ].filter(([title, text]) =>
    `${title} ${text}`.toLowerCase().includes(query.toLowerCase()),
  );
  const submitClaim = (event: FormEvent) => {
    event.preventDefault();
    if (!bookingId || !reason || description.trim().length < 10) {
      setNotice(
        "Seleccioná una reserva, un motivo y describí el caso en al menos 10 caracteres.",
      );
      return;
    }
    const claim = createClaim(bookingId, reason, description);
    setNotice(
      `Solicitud ${claim.id} registrada. Podés seguir su estado debajo.`,
    );
    setReason("");
    setDescription("");
  };
  const sendChat = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    const current = message;
    setChat((all) => [
      ...all,
      `Vos: ${current}`,
      "Asistente: Gracias por escribirnos. Para esta demostración registré tu consulta y un asesor podrá orientarte con los detalles de la reserva.",
    ]);
    setMessage("");
  };
  return (
    <>
      <PageBanner
        title="¿Cómo podemos ayudarte?"
        subtitle="Gestioná tus consultas, asistencia y solicitudes sin acudir a una sucursal."
        crumb="ASISTENCIA"
        image
      />
      <main className="assistance-page">
        <section className="help-search">
          <h2>Centro de asistencia digital</h2>
          <p>Encontrá respuestas rápidas para que viajes tranquilo.</p>
          <label>
            <Icon>⌕</Icon>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscá una pregunta o tema de ayuda"
            />
          </label>
        </section>
        <div className="assistance-grid">
          <section className="faq-panel">
            <h2>Preguntas frecuentes</h2>
            {faqs.length ? (
              faqs.map(([title, text]) => (
                <details key={title}>
                  <summary>
                    {title}
                    <b>⌄</b>
                  </summary>
                  <p>{text}</p>
                </details>
              ))
            ) : (
              <p className="empty-state">
                No encontramos resultados. Intentá con otra palabra.
              </p>
            )}
          </section>
          <section className="chat-panel">
            <h2>
              <Icon>♧</Icon> Chat de soporte <span>● En línea</span>
            </h2>
            <div className="chat-log">
              {chat.map((line, i) => (
                <p
                  className={line.startsWith("Vos:") ? "mine" : ""}
                  key={`${line}-${i}`}
                >
                  {line}
                </p>
              ))}
            </div>
            <form onSubmit={sendChat}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribí tu mensaje..."
              />
              <button className="primary" aria-label="Enviar mensaje">
                ↑
              </button>
            </form>
          </section>
          <section className="claim-panel">
            <h2>
              <Icon>▤</Icon> Registrar una solicitud
            </h2>
            <p>
              Asociá tu consulta o reclamo a una reserva para darle seguimiento.
            </p>
            {notice && <p className="success-notice">✓ {notice}</p>}
            <form onSubmit={submitClaim}>
              <label>
                Reserva
                <select
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} · {b.package.destination}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Motivo
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Seleccioná un motivo</option>
                  <option>Modificación de reserva</option>
                  <option>Consulta sobre documentación</option>
                  <option>Asistencia durante el viaje</option>
                  <option>Otro reclamo</option>
                </select>
              </label>
              <label>
                Descripción
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contanos qué necesitás..."
                />
              </label>
              <button className="primary full">Enviar solicitud →</button>
            </form>
          </section>
        </div>
        <section className="claims-list">
          <h2>Mis solicitudes y reclamos</h2>
          {claims.length ? (
            claims.map((claim) => (
              <article key={claim.id}>
                <span className="claim-icon">▤</span>
                <div>
                  <b>{claim.reason}</b>
                  <p>
                    {claim.id} · Reserva {claim.bookingId} ·{" "}
                    {claim.createdAt.slice(0, 10)}
                  </p>
                  <small>
                    {claim.history[0].label}: {claim.history[0].date}
                  </small>
                </div>
                <span className="status pending">● {claim.status}</span>
                <button className="link">Ver detalle →</button>
              </article>
            ))
          ) : (
            <div className="empty-state">
              Todavía no tenés solicitudes abiertas. Cuando necesites ayuda,
              podés crear una desde este formulario.
            </div>
          )}
        </section>
        <section className="emergency">
          <Icon>✚</Icon>
          <div>
            <h2>¿Necesitás asistencia urgente?</h2>
            <p>Contás con atención 24/7 durante tu viaje.</p>
          </div>
          <button
            className="primary"
            onClick={() =>
              setNotice(
                "Solicitud de asistencia urgente registrada. En esta demo, un asesor se comunicará contigo.",
              )
            }
          >
            Solicitar ayuda ahora
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}
