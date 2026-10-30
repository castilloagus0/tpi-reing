export function CheckoutStepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = ["Selección", "Viajeros", "Pago", "Confirmación"];
  return (
    <div className="stepper">
      {steps.map((label, index) => (
        <div className={index + 1 <= step ? "done" : ""} key={label}>
          <span>{index + 1 < step ? "✓" : index + 1}</span>
          <b>{label}</b>
          <small>
            {
              [
                "Vuelos, hotel y servicios",
                "Datos de los pasajeros",
                "Método de pago",
                "¡Tu viaje está listo!",
              ][index]
            }
          </small>
        </div>
      ))}
    </div>
  );
}
