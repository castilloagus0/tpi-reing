import { ArrowRight, CircleCheckBig, CreditCard, Landmark, Lock, Mail, UserRound, Wallet } from "lucide-react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper";
import { ReservationSummary } from "../components/checkout/ReservationSummary";
import { Footer } from "../components/layout/Footer";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { TextareaField, TextField } from "../components/ui/Field";
import type { Traveller } from "../models";
import { useTravel } from "../services/TravelStore";
import { cx } from "../utils/cx";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { navigate } from "../utils/navigation";
import { hasValidCheckoutData } from "../utils/validators";

const REQUESTS = [
  "Asiento preferido en el vuelo",
  "Habitación cama doble",
  "Habitación camas separadas",
  "Necesidades de accesibilidad",
  "Ocasión especial",
];

const PAYMENTS: Array<{ name: string; hint: string; icon: ReactNode }> = [
  { name: "Tarjeta de prueba", hint: "Simulación segura", icon: <CreditCard /> },
  { name: "Transferencia bancaria", hint: "Pago de demostración", icon: <Landmark /> },
  { name: "Mercado Pago", hint: "Pago de demostración", icon: <Wallet /> },
  { name: "PayPal", hint: "Pago de demostración", icon: <Wallet /> },
];

function Section({ icon, title, description, children }: { icon: ReactNode; title: string; description?: string; children: ReactNode }) {
  return (
    <Card as="section" className="form-section">
      <div className="form-section__head">
        <span className="form-section__icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <h2 className="form-section__title">{title}</h2>
          {description && <p className="form-section__desc">{description}</p>}
        </div>
      </div>
      {children}
    </Card>
  );
}

export function CheckoutPage() {
  const { criteria, selectedPackage, getTotal, createBooking, bookings } = useTravel();
  const confirmationId = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("confirmado");
  const confirmedBooking = confirmationId ? bookings.find((booking) => booking.id === confirmationId) : undefined;
  const initialTravellers = Array.from({ length: Math.max(1, criteria.adults) }, (_, i) => ({
    name: i ? "Carlos" : "María Fernanda",
    surname: i ? "Rodríguez" : "García López",
    birthDate: i ? "1988-07-22" : "1990-03-14",
    nationality: "Argentina",
    document: i ? "B98765432" : "A12345678",
  }));
  const [travellers, setTravellers] = useState<Traveller[]>(initialTravellers);
  const [email, setEmail] = useState("maria.garcia@email.com");
  const [emailConfirm, setEmailConfirm] = useState("maria.garcia@email.com");
  const [phone, setPhone] = useState("+54 9 11 3456-7890");
  const [payment, setPayment] = useState("Tarjeta de prueba");
  const [requests, setRequests] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const errorRef = useRef<HTMLDivElement>(null);

  const updateTraveller = (index: number, key: keyof Traveller, value: string) =>
    setTravellers((all) => all.map((traveller, i) => (i === index ? { ...traveller, [key]: value } : traveller)));

  const required = (value: string) => (submitted && !value.trim() ? "Completá este campo" : undefined);
  const emailError = submitted && !/^\S+@\S+\.\S+$/.test(email) ? "Ingresá un correo válido" : undefined;
  const confirmError = submitted && emailConfirm !== email ? "Los correos no coinciden" : undefined;
  const phoneError = submitted && phone.length < 8 ? "Ingresá un teléfono de contacto" : undefined;

  function confirm(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!hasValidCheckoutData(travellers, email, phone) || emailConfirm !== email) {
      setErrors(["Revisá los campos marcados: faltan datos de los viajeros o de contacto."]);
      window.requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    const booking = createBooking(travellers, email, phone);
    navigate("/checkout", `?confirmado=${booking.id}`);
  }

  if (confirmedBooking) {
    const booking = confirmedBooking;
    return (
      <>
        <CheckoutStepper step={3} />
        <main id="main" className="page container confirmation" tabIndex={-1}>
          <span className="confirmation__icon" aria-hidden="true">
            <CircleCheckBig />
          </span>
          <p className="eyebrow">Reserva confirmada</p>
          <h1 className="confirmation__title">¡Todo listo para viajar!</h1>
          <p className="confirmation__text">
            Tu pago de prueba fue aprobado. Te enviamos los vouchers a <strong>{booking.email}</strong>.
          </p>
          <Card className="confirmation__card">
            <dl className="facts">
              <div>
                <dt>Código de reserva</dt>
                <dd className="mono facts__strong">{booking.id}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd className="facts__strong">{formatCurrency(booking.total)}</dd>
              </div>
              <div>
                <dt>Destino</dt>
                <dd>
                  {booking.package.destination}, {booking.package.country}
                </dd>
              </div>
              <div>
                <dt>Fechas</dt>
                <dd>
                  {formatDate(booking.criteria.departure)} – {formatDate(booking.criteria.returnDate)}
                </dd>
              </div>
            </dl>
          </Card>
          <Button size="lg" trailingIcon={<ArrowRight aria-hidden="true" />} onClick={() => navigate("/mis-viajes")}>
            Ver mi viaje
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <CheckoutStepper step={2} />
      <main id="main" className="page container checkout" tabIndex={-1}>
        <h1 className="sr-only">Completá tu reserva</h1>
        <form className="checkout__form" onSubmit={confirm} noValidate>
          {errors.length > 0 && (
            <div ref={errorRef} tabIndex={-1} className="checkout__errors">
              {errors.map((e) => (
                <Alert tone="danger" key={e}>
                  {e}
                </Alert>
              ))}
            </div>
          )}

          <Section icon={<UserRound />} title="Datos de los viajeros" description="Tal como figuran en el documento de identidad.">
            {travellers.map((traveller, index) => (
              <fieldset className="traveller" key={index}>
                <legend className="traveller__legend">
                  Viajero {index + 1}
                  <span>{index ? "Adulto" : "Adulto · Titular de la reserva"}</span>
                </legend>
                <div className="form-grid form-grid--3">
                  <TextField label="Nombre(s)" autoComplete={index ? "off" : "given-name"} value={traveller.name} error={required(traveller.name)} onChange={(e) => updateTraveller(index, "name", e.target.value)} />
                  <TextField label="Apellido(s)" autoComplete={index ? "off" : "family-name"} value={traveller.surname} error={required(traveller.surname)} onChange={(e) => updateTraveller(index, "surname", e.target.value)} />
                  <TextField label="Fecha de nacimiento" type="date" value={traveller.birthDate} error={required(traveller.birthDate)} onChange={(e) => updateTraveller(index, "birthDate", e.target.value)} />
                  <TextField label="Nacionalidad" value={traveller.nationality} error={required(traveller.nationality)} onChange={(e) => updateTraveller(index, "nationality", e.target.value)} />
                  <TextField label="Número de documento" value={traveller.document} error={required(traveller.document)} onChange={(e) => updateTraveller(index, "document", e.target.value)} />
                </div>
              </fieldset>
            ))}
          </Section>

          <Section icon={<Mail />} title="Contacto" description="Te enviamos la confirmación a estos datos.">
            <div className="form-grid form-grid--3">
              <TextField label="Correo electrónico" type="email" autoComplete="email" value={email} error={emailError} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Confirmar correo" type="email" autoComplete="email" value={emailConfirm} error={confirmError} onChange={(e) => setEmailConfirm(e.target.value)} />
              <TextField label="Teléfono móvil" type="tel" autoComplete="tel" value={phone} error={phoneError} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <label className="check-row">
              <input type="checkbox" defaultChecked />
              <span>Quiero recibir ofertas y novedades de MundoGlobal Travel.</span>
            </label>
          </Section>

          <Section icon={<CircleCheckBig />} title="Solicitudes especiales" description="Opcional. Se las pasamos al hotel y a la aerolínea.">
            <div className="chips" role="group" aria-label="Solicitudes rápidas">
              {REQUESTS.map((r) => {
                const on = requests.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    className={cx("chip", on && "chip--on")}
                    aria-pressed={on}
                    onClick={() => setRequests((all) => (on ? all.filter((x) => x !== r) : [...all, r]))}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
            <TextareaField label="Otra solicitud" placeholder="Escribí cualquier solicitud adicional…" maxLength={300} />
          </Section>

          <Section icon={<Lock />} title="Método de pago" description="Demostración: no se solicita ni guarda información financiera real.">
            <fieldset className="pay-options">
              <legend className="sr-only">Elegí un método de pago</legend>
              {PAYMENTS.map((method) => (
                <label key={method.name} className="pay-option">
                  <input
                    type="radio"
                    name="payment"
                    value={method.name}
                    checked={payment === method.name}
                    onChange={() => setPayment(method.name)}
                  />
                  <span className="pay-option__icon" aria-hidden="true">
                    {method.icon}
                  </span>
                  <span className="pay-option__text">
                    <strong>{method.name}</strong>
                    <small>{method.hint}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            <Alert tone="info">Pago ficticio: al confirmar se simula una aprobación. No ingreses datos reales.</Alert>
          </Section>

          <Button type="submit" size="lg" full leadingIcon={<Lock aria-hidden="true" />}>
            Pagar {formatCurrency(getTotal())} y confirmar
          </Button>
        </form>
        <div className="checkout__summary">
          <ReservationSummary package={selectedPackage} total={getTotal()} />
        </div>
      </main>
      <Footer />
    </>
  );
}
