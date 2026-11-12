import { useEffect, useState } from "react";

export type FlightStatusKind = "on-time" | "delayed";

export interface FlightStatus {
  kind: FlightStatusKind;
  /** Minutos de demora (0 si está en horario). */
  delayMinutes: number;
  updatedAt: Date;
}

/** Secuencia mock que simula las actualizaciones de un feed en vivo. */
const FEED: Array<Omit<FlightStatus, "updatedAt">> = [
  { kind: "on-time", delayMinutes: 0 },
  { kind: "on-time", delayMinutes: 0 },
  { kind: "delayed", delayMinutes: 25 },
  { kind: "delayed", delayMinutes: 40 },
  { kind: "on-time", delayMinutes: 0 },
];

/**
 * Simula el estado en vivo de un vuelo cambiando cada `intervalMs`.
 * Si `enabled` es false devuelve siempre "en horario" sin timers.
 */
export function useFlightStatus(enabled = true, intervalMs = 12000): FlightStatus {
  const [step, setStep] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(() => new Date());

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % FEED.length);
      setUpdatedAt(new Date());
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [enabled, intervalMs]);

  const current = enabled ? FEED[step] : FEED[0];
  return { ...current, updatedAt };
}

export function statusLabel(status: FlightStatus): string {
  return status.kind === "on-time" ? "En horario" : `Demorado ${status.delayMinutes} min`;
}
