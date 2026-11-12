import { useEffect, useState } from "react";

/** Simula una carga de red breve para mostrar estados skeleton en la demo. */
export function useSimulatedLoading(ms = 450): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(timer);
  }, [ms]);
  return loading;
}
