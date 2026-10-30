import { useState, type FormEvent } from "react";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper";
import { ReservationSummary } from "../components/checkout/ReservationSummary";
import { Footer } from "../components/layout/Footer";
import { Icon } from "../components/ui/Icon";
import { Input } from "../components/ui/Input";
import type { Traveller } from "../models";
import { useTravel } from "../services/TravelStore";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { navigate } from "../utils/navigation";
import { hasValidCheckoutData } from "../utils/validators";

export function CheckoutPage() {
  const { criteria, selectedPackage, getTotal, createBooking, bookings } =
    useTravel();
  const confirmationId = new URLSearchParams(
    window.location.hash.split("?")[1] ?? "",
  ).get("confirmado");
  const confirmedBooking = confirmationId
    ? bookings.find((booking) => booking.id === confirmationId)
    : undefined;
  const initialTravellers = Array.from(
    { length: Math.max(1, criteria.adults) },
    (_, i) => ({
      name: i ? "Carlos" : "María Fernanda",
      surname: i ? "Rodríguez" : "García López",
      birthDate: i ? "1988-07-22" : "1990-03-14",
      nationality: "Argentina",
      document: i ? "B98765432" : "A12345678",
    }),
  );
  const [travellers, setTravellers] = useState<Traveller[]>(initialTravellers);
  const [email, setEmail] = useState("maria.garcia@email.com");
  const [phone, setPhone] = useState("+54 9 11 3456-7890");
  const [payment, setPayment] = useState("Tarjeta de prueba");
  const [errors, setErrors] = useState<string[]>([]);
  const updateTraveller = (
    index: number,
    key: keyof Traveller,
    value: string,
  ) =>
    setTravellers((all) =>
      all.map((traveller, i) =>
        i === index ? { ...traveller, [key]: value } : traveller,
      ),
    );
  function confirm(event: FormEvent) {
    event.preventDefault();
    if (!hasValidCheckoutData(travellers, email, phone)) {
      setErrors([
        "Completá todos los datos de los viajeros, un correo válido y un teléfono de contacto.",
      ]);
      return;
    }
    const booking = createBooking(travellers, email, phone);
    navigate("/checkout", `?confirmado=${booking.id}`);
  }
  if (confirmedBooking) {
    const booking = confirmedBooking;
    return (
      <>
        <CheckoutStepper step={4} />
        <main className="confirmation">
          <div className="success-circle">✓</div>
          <p className="eyebrow">RESERVA CONFIRMADA</p>
          <h1>¡Todo listo para viajar!</h1>
          <p>
            Tu pago de prueba fue aprobado y registramos tu reserva. Te enviamos
            los vouchers a <b>{booking.email}</b>.
          </p>
          <div className="confirmation-card">
            <span>Código de reserva</span>
            <b>{booking.id}</b>
            <hr />
            <div>
              <span>
                {booking.package.destination}, {booking.package.country}
              </span>
              <span>
                {formatDate(booking.criteria.departure)} —{" "}
                {formatDate(booking.criteria.returnDate)}
              </span>
              <span>{formatCurrency(booking.total)}</span>
            </div>
          </div>
          <button className="primary" onClick={() => navigate("/mis-viajes")}>
            Ver mi viaje&nbsp; →
          </button>
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <CheckoutStepper step={2} />
      <main className="checkout-page">
        <form className="checkout-form" onSubmit={confirm} noValidate>
          {errors.map((e) => (
            <p className="form-error" key={e}>
              {e}
            </p>
          ))}
          <section className="checkout-section">
            <h2>
              <Icon>▣</Icon> Datos de los viajeros
            </h2>
            <p>
              Ingresá la información de los pasajeros tal como aparece en sus
              documentos de identidad.
            </p>
            {travellers.map((traveller, index) => (
              <div className="traveller" key={index}>
                <h3>
                  <Icon>♙</Icon> Viajero {index + 1}
                  <small>
                    {index ? "Adulto" : "Adulto (Titular de la reserva)"}
                  </small>
                </h3>
                <div className="traveller-fields">
                  <Input
                    label="Nombre(s)"
                    value={traveller.name}
                    onChange={(v) => updateTraveller(index, "name", v)}
                  />
                  <Input
                    label="Apellido(s)"
                    value={traveller.surname}
                    onChange={(v) => updateTraveller(index, "surname", v)}
                  />
                  <Input
                    label="Fecha de nacimiento"
                    type="date"
                    value={traveller.birthDate}
                    onChange={(v) => updateTraveller(index, "birthDate", v)}
                  />
                  <Input
                    label="Nacionalidad"
                    value={traveller.nationality}
                    onChange={(v) => updateTraveller(index, "nationality", v)}
                  />
                  <Input
                    label="Número de documento"
                    value={traveller.document}
                    onChange={(v) => updateTraveller(index, "document", v)}
                  />
                </div>
              </div>
            ))}
          </section>
          <section className="checkout-section">
            <h2>
              <Icon>✉</Icon> Información de contacto
            </h2>
            <p>Te enviaremos la confirmación de tu viaje a estos datos.</p>
            <div className="contact-fields">
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <Input
                label="Confirmar correo electrónico"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <Input label="Teléfono móvil" value={phone} onChange={setPhone} />
            </div>
            <label className="check">
              <input type="checkbox" defaultChecked /> Quiero recibir ofertas,
              recomendaciones y novedades de MundoGlobal Travel.
            </label>
          </section>
          <section className="checkout-section">
            <h2>
              <Icon>♡</Icon> Solicitudes especiales <small>(opcional)</small>
            </h2>
            <div className="request-grid">
              {[
                "Asiento preferido en el vuelo",
                "Habitación cama doble",
                "Habitación camas separadas",
                "Necesidades de accesibilidad",
                "Ocasión especial",
              ].map((r) => (
                <button key={r} type="button">
                  ⌁&nbsp; {r}
                </button>
              ))}
            </div>
            <textarea
              aria-label="Solicitud especial"
              placeholder="Escribe aquí cualquier solicitud adicional..."
              maxLength={300}
            ></textarea>
          </section>
          <section className="checkout-section">
            <h2>
              <Icon>▣</Icon> Método de pago
            </h2>
            <p>
              Elegí tu forma de pago preferida. Esta demostración no solicita ni
              almacena información financiera real.
            </p>
            <div className="payment-methods">
              {[
                "Tarjeta de prueba",
                "Transferencia bancaria",
                "Mercado Pago",
                "PayPal",
              ].map((method) => (
                <button
                  key={method}
                  className={payment === method ? "selected" : ""}
                  type="button"
                  onClick={() => setPayment(method)}
                >
                  <Icon>
                    {method === "PayPal"
                      ? "P"
                      : method === "Mercado Pago"
                        ? "◒"
                        : method === "Transferencia bancaria"
                          ? "▰"
                          : "▣"}
                  </Icon>
                  <b>{method}</b>
                  <small>
                    {method === "Tarjeta de prueba"
                      ? "Simulación segura"
                      : "Pago de demostración"}
                  </small>
                </button>
              ))}
            </div>
            <div className="demo-notice">
              🔒 Pago ficticio: al confirmar se simulará una aprobación segura.
              No ingreses datos de tarjeta ni credenciales reales.
            </div>
          </section>
          <button className="primary full pay-button">
            🔒 Pagar y confirmar&nbsp; →
          </button>
        </form>
        <ReservationSummary package={selectedPackage} total={getTotal()} />
      </main>
      <Footer />
    </>
  );
}
