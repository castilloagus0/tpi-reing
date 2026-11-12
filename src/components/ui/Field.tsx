import { CalendarDays } from "lucide-react";
import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { formatDate } from "../../utils/formatDate";

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
}

function FieldShell({
  id,
  label,
  hint,
  error,
  className,
  children,
}: FieldShellProps & { id: string; children: ReactNode }) {
  return (
    <div className={className ? `field ${className}` : "field"}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <span className="field__hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field__error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function TextField({
  label,
  hint,
  error,
  className,
  ...input
}: FieldShellProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <input
        id={id}
        className="control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...input}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  className,
  children,
  ...select
}: FieldShellProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <select
        id={id}
        className="control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...select}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextareaField({
  label,
  hint,
  error,
  className,
  ...textarea
}: FieldShellProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        className="control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...textarea}
      />
    </FieldShell>
  );
}

/**
 * Fecha con input nativo (accesible, con calendario del sistema) pero
 * mostrada en formato local ("15 ene 2027") sin depender del idioma del
 * navegador. Al escribir con teclado se muestra el input nativo.
 */
export function DateField({
  label,
  hint,
  error,
  className,
  value,
  onBlur,
  onKeyDown,
  ...input
}: FieldShellProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { value: string }) {
  const id = useId();
  const [typing, setTyping] = useState(false);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <div className={typing ? "date-control is-typing" : "date-control"}>
        <input
          id={id}
          type="date"
          className="control date-control__input"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          onKeyDown={(event) => {
            if (event.key !== "Tab" && event.key !== "Shift") setTyping(true);
            onKeyDown?.(event);
          }}
          onBlur={(event) => {
            setTyping(false);
            onBlur?.(event);
          }}
          {...input}
        />
        <span className="date-control__display" aria-hidden="true">
          {value ? formatDate(value) : "Elegí una fecha"}
        </span>
        <CalendarDays className="date-control__icon" aria-hidden="true" />
      </div>
    </FieldShell>
  );
}
