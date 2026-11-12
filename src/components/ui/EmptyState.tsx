import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  text,
  action,
  titleAs: Title = "h3",
}: {
  titleAs?: "h1" | "h2" | "h3";
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
      <Title className="empty-block__title">{title}</Title>
      {text && <p className="empty-block__text">{text}</p>}
      {action}
    </div>
  );
}
