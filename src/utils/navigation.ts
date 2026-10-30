export type Route =
  | "/"
  | "/paquetes"
  | "/checkout"
  | "/mis-viajes"
  | "/asistencia";

export function navigate(route: Route, query = ""): void {
  window.location.hash = `${route}${query}`;
}
