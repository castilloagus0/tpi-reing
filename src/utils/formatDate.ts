const toDate = (value: string) =>
  new Date(value.includes("T") ? value : `${value}T12:00:00`);

/** "14 dic 2026" */
export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(toDate(value));

/** "09:40" */
export const formatTime = (value: string | Date): string =>
  new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(typeof value === "string" ? toDate(value) : value);

/** "lun 14 dic" */
export const formatDayShort = (value: string): string =>
  new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
    .format(toDate(value))
    .replace(",", "");

/** "lunes 14 de diciembre" */
export const formatDayLong = (value: string): string =>
  new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(toDate(value));

/** "9 h 05 min" */
export const formatDuration = (minutes: number): string =>
  `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")} min`;

/** Días enteros desde hoy hasta la fecha (negativo si ya pasó). */
export const daysUntil = (value: string, now = new Date()): number => {
  const target = toDate(value);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
};
