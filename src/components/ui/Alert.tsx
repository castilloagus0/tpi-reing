import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx";

const icons = {
  success: <CheckCircle2 aria-hidden="true" />,
  danger: <AlertCircle aria-hidden="true" />,
  info: <Info aria-hidden="true" />,
};

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: "success" | "danger" | "info";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx("alert", `alert--${tone}`, className)}
      role={tone === "danger" ? "alert" : "status"}
    >
      {icons[tone]}
      <div>{children}</div>
    </div>
  );
}
