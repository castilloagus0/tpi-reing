import { cx } from "../../utils/cx";

/**
 * Bloque de carga. El tamaño se define con clases (`skeleton--text`,
 * `skeleton--title`, `skeleton--media`, `skeleton--circle`) o una clase propia.
 */
export function Skeleton({
  shape = "text",
  className,
}: {
  shape?: "text" | "title" | "media" | "circle";
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cx("skeleton", `skeleton--${shape}`, className)} />
  );
}
