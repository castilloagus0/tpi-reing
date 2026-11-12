import { useState } from "react";
import { cx } from "../../utils/cx";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({
  name,
  src,
  size = "md",
  online = false,
  className,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={cx("avatar", size !== "md" && `avatar--${size}`, className)}>
      {src && !failed ? (
        <img
          className="avatar__img"
          src={src}
          alt={name}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="avatar__fallback" role="img" aria-label={name}>
          {initials(name)}
        </span>
      )}
      {online && <span className="avatar__status" aria-hidden="true" />}
    </span>
  );
}
