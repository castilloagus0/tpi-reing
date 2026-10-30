export type MealPlan = "Todo incluido" | "Media pensión" | "Desayuno incluido";

export interface SearchCriteria {
  origin: string;
  destination: string;
  departure: string;
  returnDate: string;
  adults: number;
  children: number;
  type: string;
}

export interface TravelPackage {
  id: string;
  destination: string;
  country: string;
  subtitle: string;
  airline: string;
  hotel: string;
  stars: number;
  mealPlan: MealPlan;
  nights: number;
  flightPrice: number;
  hotelPrice: number;
  assistancePrice: number;
  imageClass: string;
  badge?: string;
}

export interface Traveller {
  name: string;
  surname: string;
  birthDate: string;
  nationality: string;
  document: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  status: "Confirmado" | "Pendiente de pago";
  criteria: SearchCriteria;
  package: TravelPackage;
  travellers: Traveller[];
  email: string;
  phone: string;
  total: number;
}

export interface Claim {
  id: string;
  bookingId: string;
  reason: string;
  description: string;
  createdAt: string;
  status: "Pendiente" | "En revisión" | "En proceso" | "Resuelto" | "Rechazado";
  history: { label: string; date: string }[];
}
