import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-block">
      <span className="empty-block__icon" aria-hidden="true">
        {icon}
      </span>
      <h3 className="empty-block__title">{title}</h3>
      {text && <p className="empty-block__text">{text}</p>}
      {action}
    </div>
  );
}
