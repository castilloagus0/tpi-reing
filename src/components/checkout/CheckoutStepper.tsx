import { Check } from "lucide-react";
import { cx } from "../../utils/cx";

const STEPS = ["Selección", "Viajeros y pago", "Confirmación"];

/** step: 1-based; los anteriores quedan completados. */
export function CheckoutStepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <nav className="stepper" aria-label="Progreso de la reserva">
      <div className="stepper__inner container">
      <p className="stepper__mobile">
        Paso {step} de {STEPS.length} · <strong>{STEPS[step - 1]}</strong>
      </p>
      <ol className="stepper__list">
        {STEPS.map((label, index) => {
          const n = index + 1;
          const state = n < step ? "done" : n === step ? "current" : "todo";
          return (
            <li key={label} className={cx("stepper__item", `stepper__item--${state}`)} aria-current={state === "current" ? "step" : undefined}>
              <span className="stepper__dot" aria-hidden="true">
                {state === "done" ? <Check /> : n}
              </span>
              <span>
                {label}
                {state === "done" && <span className="sr-only"> (completado)</span>}
              </span>
            </li>
          );
        })}
      </ol>
      </div>
    </nav>
  );
}
