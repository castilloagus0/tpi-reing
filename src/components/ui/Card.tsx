import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";

type CardElement = "div" | "article" | "section" | "aside" | "li";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  children: ReactNode;
}

export function Card({
  as: Tag = "div",
  padding = "md",
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cx(
        "card",
        padding !== "none" && `card--pad-${padding}`,
        interactive && "card--interactive",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
