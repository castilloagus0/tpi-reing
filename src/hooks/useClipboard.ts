import { useCallback, useEffect, useRef, useState } from "react";

/** Copia texto al portapapeles y expone `copied` durante `resetMs`. */
export function useClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      window.clearTimeout(timer.current);
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback para contextos sin Clipboard API (http no seguro).
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.className = "sr-only";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          area.remove();
        }
        setFailed(false);
        setCopied(true);
      } catch {
        setFailed(true);
        setCopied(false);
      }
      timer.current = window.setTimeout(() => {
        setCopied(false);
        setFailed(false);
      }, resetMs);
    },
    [resetMs],
  );

  return { copy, copied, failed };
}
