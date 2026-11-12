import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { IconButton } from "./IconButton";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Oculta visualmente el título (sigue disponible para lectores). */
  hideTitle?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Basado en <dialog> nativo: trae trampa de foco, Escape y top-layer
 * sin dependencias. Click en el backdrop también cierra.
 */
function BaseDialog({
  open,
  onClose,
  title,
  hideTitle,
  children,
  className,
  variant,
}: DialogProps & { variant: "modal" | "drawer" }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx("dialog", `dialog--${variant}`, className)}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog__header">
        <h2 id={titleId} className={cx("dialog__title", hideTitle && "sr-only")}>
          {title}
        </h2>
        <IconButton label="Cerrar" icon={<X />} onClick={onClose} />
      </div>
      <div className="dialog__body">{children}</div>
    </dialog>
  );
}

export function Modal(props: DialogProps) {
  return <BaseDialog {...props} variant="modal" />;
}

export function Drawer(props: DialogProps) {
  return <BaseDialog {...props} variant="drawer" />;
}
