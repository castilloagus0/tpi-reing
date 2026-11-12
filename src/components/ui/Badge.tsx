import type { ReactNode } from "react";
import { cx } from "../../utils/cx";

export type BadgeTone =
  | "neutral"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "glass";

export interface BadgeProps {
  tone?: BadgeTone;
  /** Muestra un punto de estado a la izquierda. */
  dot?: boolean;
  /** Anima el punto (indicador "en vivo"). Respeta prefers-reduced-motion. */
  pulse?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Badge({
  tone = "neutral",
  dot = false,
  pulse = false,
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cx(
        "badge",
        tone !== "neutral" && `badge--${tone}`,
        pulse && "badge--pulse",
        className,
      )}
    >
      {(dot || pulse) && <span className="badge__dot" aria-hidden="true" />}
      {icon}
      {children}
    </span>
  );
}
