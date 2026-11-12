import { ChevronDown, ClipboardList, Headset, Search, Siren, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Footer } from "../components/layout/Footer";
import { PageHeader } from "../components/layout/PageHeader";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { SelectField, TextareaField } from "../components/ui/Field";
import type { Claim } from "../models";
import { useTravel } from "../services/TravelStore";
import { formatDate } from "../utils/formatDate";
import { openLiveChat } from "../utils/liveChat";
import { navigate } from "../utils/navigation";

const FAQS: Array<[string, string]> = [
  ["¿Cómo descargo mis vouchers?", "Ingresá a Mis viajes y, en la tarjeta Documentos, elegí el que necesitás."],
  ["¿Cómo solicito un cambio?", "Podés iniciar la solicitud con el formulario de esta página o escribirle a un asesor por el chat."],
  ["¿Qué cubre mi asistencia?", "Tu plan incluye atención 24/7, gastos médicos y equipaje con cobertura internacional según la póliza."],
  ["¿Cómo hago el check-in?", "Te avisamos cuando se habilite. Tu pase de embarque con QR aparece en Mis viajes."],
];

const STATUS_TONE: Record<Claim["status"], "neutral" | "info" | "warning" | "success" | "danger"> = {
  Pendiente: "warning",
  "En revisión": "info",
  "En proceso": "info",
  Resuelto: "success",
  Rechazado: "danger",
};

export function AssistancePage() {
  const { bookings, claims, createClaim } = useTravel();
  const [query, setQuery] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [bookingId, setBookingId] = useState(bookings[0]?.id || "");
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "danger"; text: string } | null>(null);
  const [urgent, setUrgent] = useState(false);

  const faqs = FAQS.filter(([title, text]) => `${title} ${text}`.toLowerCase().includes(query.toLowerCase()));

  const submitClaim = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!bookingId || !reason || description.trim().length < 10) {
      setNotice({ tone: "danger", text: "Seleccioná una reserva, un motivo y describí el caso en al menos 10 caracteres." });
      return;
    }
    const claim = createClaim(bookingId, reason, description);
    setNotice({ tone: "success", text: `Solicitud ${claim.id} registrada. Podés seguir su estado debajo.` });
    setSubmitted(false);
    setReason("");
    setDescription("");
  };

  return (
    <>
      <main id="main" className="page help" tabIndex={-1}>
        <PageHeader
          eyebrow="Centro de ayuda"
          title="¿Cómo podemos ayudarte?"
          subtitle="Resolvé tus dudas, hablá con nosotros o registrá una solicitud sin ir a una sucursal."
        />
        <div className="container help__stack">
          <section className="help__channels" aria-label="Canales de contacto">
            <Card interactive className="channel">
              <span className="channel__icon channel__icon--bot" aria-hidden="true">
                <Sparkles />
              </span>
              <h2 className="channel__title">Asistente de viaje</h2>
              <p className="channel__text">Respuestas al instante para salud, equipaje y hotel.</p>
              <Button variant="secondary" onClick={() => navigate("/asistente-viaje")}>
                Abrir asistente
              </Button>
            </Card>
            <Card interactive className="channel">
              <span className="channel__icon channel__icon--human" aria-hidden="true">
                <Headset />
              </span>
              <h2 className="channel__title">Hablar con una persona</h2>
              <p className="channel__text">Un asesor te responde por chat en minutos.</p>
              <Button variant="secondary" onClick={openLiveChat}>
                Iniciar chat
              </Button>
            </Card>
            <Card className="channel channel--urgent">
              <span className="channel__icon channel__icon--urgent" aria-hidden="true">
                <Siren />
              </span>
              <h2 className="channel__title">Asistencia urgente</h2>
              <p className="channel__text">Atención 24/7 durante tu viaje.</p>
              <Button variant="ink" onClick={() => setUrgent(true)} disabled={urgent}>
                {urgent ? "Solicitud enviada" : "Solicitar ayuda ahora"}
              </Button>
              {urgent && (
                <Alert tone="success">Registramos tu pedido urgente. En esta demo, un asesor se comunicaría con vos.</Alert>
              )}
            </Card>
          </section>

          <div className="help__grid">
            <section className="faq" aria-labelledby="faq-title">
              <div className="section-head">
                <h2 id="faq-title" className="section-head__title">
                  Preguntas frecuentes
                </h2>
              </div>
              <div className="search-input">
                <Search aria-hidden="true" />
                <label htmlFor="faq-search" className="sr-only">
                  Buscar en preguntas frecuentes
                </label>
                <input
                  id="faq-search"
                  type="search"
                  className="control"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscá una pregunta o tema"
                />
              </div>
              {faqs.length ? (
                <div className="faq__list">
                  {faqs.map(([title, text]) => (
                    <details key={title} className="faq__item">
                      <summary>
                        {title}
                        <ChevronDown aria-hidden="true" />
                      </summary>
                      <p>{text}</p>
                    </details>
                  ))}
                </div>
              ) : (
                <EmptyState icon={<Search />} title="Sin resultados" text="Probá con otra palabra o escribinos por el chat." />
              )}
            </section>

            <Card as="section" aria-labelledby="claim-title" className="claim-form">
              <h2 id="claim-title" className="section-head__title">
                Registrar una solicitud
              </h2>
              <p className="text-secondary">Asociá tu consulta o reclamo a una reserva para darle seguimiento.</p>
              {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
              <form onSubmit={submitClaim} noValidate className="claim-form__fields">
                <SelectField label="Reserva" value={bookingId} onChange={(e) => setBookingId(e.target.value)}>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} · {b.package.destination}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  label="Motivo"
                  value={reason}
                  error={submitted && !reason ? "Elegí un motivo" : undefined}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Seleccioná un motivo</option>
                  <option>Modificación de reserva</option>
                  <option>Consulta sobre documentación</option>
                  <option>Asistencia durante el viaje</option>
                  <option>Otro reclamo</option>
                </SelectField>
                <TextareaField
                  label="Descripción"
                  hint="Mínimo 10 caracteres."
                  value={description}
                  error={submitted && description.trim().length < 10 ? "Contanos un poco más (mínimo 10 caracteres)" : undefined}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contanos qué necesitás…"
                />
                <Button type="submit" full>
                  Enviar solicitud
                </Button>
              </form>
            </Card>
          </div>

          <section aria-labelledby="claims-title">
            <div className="section-head">
              <h2 id="claims-title" className="section-head__title">
                Mis solicitudes
              </h2>
            </div>
            {claims.length ? (
              <ul className="claims">
                {claims.map((claim) => (
                  <li key={claim.id}>
                    <Card padding="sm" className="claim">
                      <span className="claim__icon" aria-hidden="true">
                        <ClipboardList />
                      </span>
                      <div className="claim__text">
                        <strong>{claim.reason}</strong>
                        <span>
                          <span className="mono">{claim.id}</span> · Reserva {claim.bookingId} ·{" "}
                          {formatDate(claim.createdAt.slice(0, 10))}
                        </span>
                      </div>
                      <Badge tone={STATUS_TONE[claim.status]} dot>
                        {claim.status}
                      </Badge>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={<ClipboardList />}
                title="No tenés solicitudes abiertas"
                text="Cuando registres una, vas a poder seguir su estado acá."
              />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
