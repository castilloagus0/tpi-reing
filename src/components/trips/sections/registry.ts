import type { ComponentType } from "react";
import type { TripEvent, TripEventKind } from "../../../mocks/tripDetails";
import { FlightSection } from "./FlightSection";
import { HotelSection } from "./HotelSection";

type SectionComponent<K extends TripEventKind> = ComponentType<{
  event: Extract<TripEvent, { kind: K }>;
  defaultOpen?: boolean;
}>;

/**
 * Registro de secciones de la timeline. Para sumar "transfer" o "excursion",
 * agregá el tipo en mocks/tripDetails.ts y su componente acá: TypeScript
 * obliga a registrar cada `kind` existente.
 */
export const sectionRegistry: { [K in TripEventKind]: SectionComponent<K> } = {
  flight: FlightSection,
  hotel: HotelSection,
};
