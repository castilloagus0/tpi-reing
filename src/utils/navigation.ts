export type Route =
  | "/"
  | "/paquetes"
  | "/checkout"
  | "/mis-viajes"
  | "/asistencia"
  | "/asistente-viaje";

export function navigate(route: Route, query = ""): void {
  window.location.hash = `${route}${query}`;
}
