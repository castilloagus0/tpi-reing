import type { ReactNode } from "react";
import { navigate } from "../../utils/navigation";

export function SummaryLine({
  icon,
  label,
  value,
  editable = true,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <div className="summary-line">
      <span className="summary-line__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="summary-line__text">
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
      {editable && (
        <button
          type="button"
          className="btn btn--link btn--sm"
          aria-label={`Cambiar ${label.toLowerCase()}`}
          onClick={() => navigate("/paquetes")}
        >
          Cambiar
        </button>
      )}
    </div>
  );
}
