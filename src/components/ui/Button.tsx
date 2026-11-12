import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";

export type ButtonVariant = "primary" | "ink" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  full = false,
  leadingIcon,
  trailingIcon,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "btn",
        `btn--${variant}`,
        size !== "md" && `btn--${size}`,
        full && "btn--full",
        className,
      )}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
