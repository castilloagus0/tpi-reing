import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  /** Obligatorio: el botón no tiene texto visible. */
  label: string;
  icon: ReactNode;
  variant?: "ghost" | "outline" | "primary";
  size?: "sm" | "md";
}

export function IconButton({
  label,
  icon,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        "icon-btn",
        variant !== "ghost" && `icon-btn--${variant}`,
        size === "sm" && "icon-btn--sm",
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}
