import type { Booking } from "../models";
import { getHotelImage, type Media } from "./media";

/**
 * Eventos de la línea de tiempo de un viaje.
 * Para sumar una sección nueva (traslado, excursión…):
 *   1. agregá su interfaz con un `kind` propio a `TripEvent`,
 *   2. generá el evento en `getTripEvents`,
 *   3. registrá su componente en `components/trips/sections/registry.tsx`.
 */
interface TripEventBase {
  id: string;
  /** Fecha y hora local del evento, formato ISO sin zona. */
  at: string;
  title: string;
}

export interface Airport {
  code: string;
  city: string;
  terminal?: string;
}

export interface FlightEvent extends TripEventBase {
  kind: "flight";
  direction: "outbound" | "return";
  airline: string;
  flightNumber: string;
  from: Airport;
  to: Airport;
  arrival: string;
  durationMinutes: number;
  gate: string;
  seat: string;
  boardingTime: string;
  boardingGroup: string;
  cabin: string;
  passenger: string;
  boardingCode: string;
  /** Solo el próximo vuelo tiene seguimiento en vivo. */
  live: boolean;
}

export interface HotelEvent extends TripEventBase {
  kind: "hotel";
  name: string;
  stars: number;
  mealPlan: string;
  address: string;
  checkOut: string;
  nights: number;
  guests: number;
  reservationCode: string;
  allInclusive: boolean;
  coords: { lat: number; lng: number };
  image: Media;
}

export interface TransferEvent extends TripEventBase {
  kind: "transfer";
  direction: "arrival" | "departure";
  provider: string;
  vehicle: string;
  from: string;
  to: string;
  meetingPoint: string;
  durationMinutes: number;
  passengers: number;
  driver: { name: string; phone: string };
  voucher: string;
}

export type TripEvent = FlightEvent | HotelEvent | TransferEvent;
export type TripEventKind = TripEvent["kind"];

const hotelLocations: Record<string, { address: string; lat: number; lng: number }> = {
  cancun: {
    address: "Blvd. Kukulcán km 5.5, Zona Hotelera, Cancún",
    lat: 21.1394,
    lng: -86.7516,
  },
  roma: { address: "Via Labicana 125, Roma", lat: 41.8893, lng: 12.4988 },
  paris: { address: "Rue de Bretagne 44, París", lat: 48.8631, lng: 2.3624 },
  bariloche: {
    address: "Av. Ezequiel Bustillo km 25, Bariloche",
    lat: -41.0553,
    lng: -71.5323,
  },
  "punta-cana": {
    address: "Playa Bávaro, Punta Cana",
    lat: 18.7173,
    lng: -68.4498,
  },
};

const airportCode = (place: string) => place.match(/\(([A-Z]{3})\)/)?.[1] ?? place.slice(0, 3).toUpperCase();
const cityName = (place: string) => place.replace(/\s*\(.*\)/, "");

const airlineCode: Record<string, string> = {
  "Aerolíneas Argentinas": "AR",
  "ITA Airways": "AZ",
  "Air France": "AF",
};

function addMinutes(iso: string, minutes: number): string {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() + minutes);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getTripEvents(booking: Booking): TripEvent[] {
  const { criteria, package: pkg } = booking;
  const passenger = booking.travellers[0]
    ? `${booking.travellers[0].surname} / ${booking.travellers[0].name}`.toUpperCase()
    : "PASAJERO / TITULAR";
  const code = airlineCode[pkg.airline] ?? "MG";
  const origin = criteria.origin;
  const destination = criteria.destination;
  const location = hotelLocations[pkg.id] ?? hotelLocations.cancun;
  const duration = 545;

  const outboundAt = `${criteria.departure}T09:40`;
  const returnAt = `${criteria.returnDate}T15:25`;
  const outboundArrival = addMinutes(outboundAt, duration);

  const passengers = booking.travellers.length || criteria.adults;
  const transferBase = {
    kind: "transfer" as const,
    provider: "MundoGlobal Transfers",
    vehicle: "Van privada · hasta 6 pasajeros",
    durationMinutes: 25,
    passengers,
    driver: { name: "Jorge Medina", phone: "+52 998 555 0142" },
  };

  const events: TripEvent[] = [
    {
      kind: "flight",
      id: "flight-outbound",
      direction: "outbound",
      title: "Vuelo de ida",
      at: outboundAt,
      arrival: outboundArrival,
      durationMinutes: duration,
      airline: pkg.airline,
      flightNumber: `${code} 1302`,
      from: { code: airportCode(origin), city: cityName(origin), terminal: "A" },
      to: { code: airportCode(destination), city: cityName(destination) },
      gate: "12",
      seat: "14C",
      boardingTime: addMinutes(outboundAt, -40),
      boardingGroup: "B",
      cabin: "Economy",
      passenger,
      boardingCode: `M1${passenger.replace(/\W/g, "").slice(0, 12)} ${booking.id} ${airportCode(origin)}${airportCode(destination)} ${code}1302 014C`,
      live: true,
    },
    {
      ...transferBase,
      id: "transfer-arrival",
      direction: "arrival",
      title: "Traslado al hotel",
      at: addMinutes(outboundArrival, 40),
      from: `Aeropuerto ${airportCode(destination)}`,
      to: pkg.hotel,
      meetingPoint: "Salida de Arribos, puerta B. Buscá el cartel con tu apellido.",
      voucher: `TR-${booking.id.slice(2)}-IN`,
    },
    {
      kind: "hotel",
      id: "hotel-stay",
      title: "Check-in en el hotel",
      at: addMinutes(outboundArrival, 90),
      checkOut: `${criteria.returnDate}T11:00`,
      name: pkg.hotel,
      stars: pkg.stars,
      mealPlan: pkg.mealPlan,
      nights: pkg.nights,
      guests: booking.travellers.length || criteria.adults,
      address: location.address,
      coords: { lat: location.lat, lng: location.lng },
      reservationCode: `${pkg.mealPlan === "Todo incluido" ? "AI" : "HT"}-${booking.id.slice(2)}-${pkg.nights}N`,
      allInclusive: pkg.mealPlan === "Todo incluido",
      image: getHotelImage(pkg.id),
    },
    {
      ...transferBase,
      id: "transfer-departure",
      direction: "departure",
      title: "Traslado al aeropuerto",
      at: addMinutes(returnAt, -180),
      from: pkg.hotel,
      to: `Aeropuerto ${airportCode(destination)}`,
      meetingPoint: "Lobby del hotel. El chofer te espera 10 minutos antes.",
      voucher: `TR-${booking.id.slice(2)}-OUT`,
    },
    {
      kind: "flight",
      id: "flight-return",
      direction: "return",
      title: "Vuelo de regreso",
      at: returnAt,
      arrival: addMinutes(returnAt, duration),
      durationMinutes: duration,
      airline: pkg.airline,
      flightNumber: `${code} 1303`,
      from: { code: airportCode(destination), city: cityName(destination), terminal: "3" },
      to: { code: airportCode(origin), city: cityName(origin) },
      gate: "B7",
      seat: "15C",
      boardingTime: addMinutes(returnAt, -40),
      boardingGroup: "B",
      cabin: "Economy",
      passenger,
      boardingCode: `M1${passenger.replace(/\W/g, "").slice(0, 12)} ${booking.id} ${airportCode(destination)}${airportCode(origin)} ${code}1303 015C`,
      live: false,
    },
  ];

  return events.sort((a, b) => a.at.localeCompare(b.at));
}
