export interface LatLng {
  lat: number;
  lng: number;
}

const coords = ({ lat, lng }: LatLng) => `${lat},${lng}`;

/** URL de Google Maps: ruta si hay origen, si no solo el punto. */
export function googleMapsUrl(destination: LatLng, origin?: LatLng): string {
  if (origin) {
    const params = new URLSearchParams({
      api: "1",
      origin: coords(origin),
      destination: coords(destination),
    });
    return `https://www.google.com/maps/dir/?${params}`;
  }
  const params = new URLSearchParams({ api: "1", query: coords(destination) });
  return `https://www.google.com/maps/search/?${params}`;
}

/** Pide la ubicación del usuario. Resuelve `undefined` si no hay permiso. */
export function getCurrentPosition(timeoutMs = 8000): Promise<LatLng | undefined> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(undefined);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: Number(position.coords.latitude.toFixed(5)),
          lng: Number(position.coords.longitude.toFixed(5)),
        }),
      () => resolve(undefined),
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 300_000 },
    );
  });
}
