import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function SearchField({
  label,
  icon,
  children,
  className = "",
}: {
  label: string;
  icon: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`search-field ${className}`}>
      <Icon>{icon}</Icon>
      <span>
        <small>{label}</small>
        {children}
      </span>
    </label>
  );
}
