import type { ReactNode } from "react";

export function Icon({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`icon ${className}`}>
      {children}
    </span>
  );
}
