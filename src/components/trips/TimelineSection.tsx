import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx";

export interface TimelineSectionProps {
  /** Contenido de la cabecera (vista colapsada). */
  summary: ReactNode;
  /** Contenido extra visible siempre, fuera del botón (p. ej. regiones aria-live). */
  aside?: ReactNode;
  /** Etiqueta accesible del botón de expandir. */
  label: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Tarjeta-acordeón genérica para cualquier sección del viaje.
 * Accesible: botón con aria-expanded/aria-controls, panel con role=region
 * e `inert` mientras está cerrado (no recibe foco ni lo leen los lectores).
 */
export function TimelineSection({
  summary,
  aside,
  label,
  defaultOpen = false,
  children,
  className,
}: TimelineSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const headerId = useId();
  const panelId = useId();

  return (
    <article className={cx("tsec", open && "tsec--open", className)}>
      <h3 className="tsec__heading">
        <button
          type="button"
          id={headerId}
          className="tsec__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{label}</span>
          <span className="tsec__summary">{summary}</span>
          <span className="tsec__chevron" aria-hidden="true">
            <ChevronDown />
          </span>
        </button>
      </h3>
      {aside}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="tsec__panel"
        data-open={open}
        inert={!open}
      >
        <div className="tsec__panel-inner">
          <div className="tsec__content">{children}</div>
        </div>
      </div>
    </article>
  );
}
