import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

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
