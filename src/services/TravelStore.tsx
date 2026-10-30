import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultSearch, initialBookings, packagesMock } from "../mocks/catalog";
import type {
  Booking,
  Claim,
  SearchCriteria,
  Traveller,
  TravelPackage,
} from "../models";
import { calculatePackagePrice } from "../utils/calculatePackagePrice";

type TravelState = {
  criteria: SearchCriteria;
  selectedPackage: TravelPackage;
  bookings: Booking[];
  claims: Claim[];
  setCriteria: (criteria: SearchCriteria) => void;
  selectPackage: (pkg: TravelPackage) => void;
  createBooking: (
    travellers: Traveller[],
    email: string,
    phone: string,
  ) => Booking;
  createClaim: (
    bookingId: string,
    reason: string,
    description: string,
  ) => Claim;
  getTotal: (pkg?: TravelPackage) => number;
};

const TravelContext = createContext<TravelState | null>(null);
const STORAGE = "mundoglobal-travel-state-v1";

function restoreState(): Partial<{
  criteria: SearchCriteria;
  selectedPackage: TravelPackage;
  bookings: Booking[];
  claims: Claim[];
}> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE) ?? "{}") as ReturnType<
      typeof restoreState
    >;
  } catch {
    return {};
  }
}

export function TravelProvider({ children }: { children: ReactNode }) {
  const [restored] = useState(restoreState);
  const [criteria, setCriteria] = useState(restored.criteria ?? defaultSearch);
  const [selectedPackage, selectPackage] = useState(
    restored.selectedPackage ?? packagesMock[0],
  );
  const [bookings, setBookings] = useState<Booking[]>(
    restored.bookings ?? initialBookings,
  );
  const [claims, setClaims] = useState<Claim[]>(restored.claims ?? []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE,
      JSON.stringify({ criteria, selectedPackage, bookings, claims }),
    );
  }, [criteria, selectedPackage, bookings, claims]);

  const getTotal = (pkg = selectedPackage) => calculatePackagePrice(pkg);

  const createBooking = (
    travellers: Traveller[],
    email: string,
    phone: string,
  ) => {
    const booking: Booking = {
      id: `MG${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "Confirmado",
      criteria,
      package: selectedPackage,
      travellers,
      email,
      phone,
      total: getTotal(),
    };
    setBookings((value) => [booking, ...value]);
    return booking;
  };

  const createClaim = (
    bookingId: string,
    reason: string,
    description: string,
  ) => {
    const claim: Claim = {
      id: `SOL-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      bookingId,
      reason,
      description,
      createdAt: new Date().toISOString(),
      status: "Pendiente",
      history: [
        {
          label: "Solicitud recibida",
          date: new Date().toLocaleDateString("es-AR"),
        },
      ],
    };
    setClaims((value) => [claim, ...value]);
    return claim;
  };

  const value = {
    criteria,
    selectedPackage,
    bookings,
    claims,
    setCriteria,
    selectPackage,
    createBooking,
    createClaim,
    getTotal,
  };
  return (
    <TravelContext.Provider value={value}>{children}</TravelContext.Provider>
  );
}

// This intentionally exports the shared context hook alongside its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) throw new Error("useTravel must be used inside TravelProvider");
  return context;
}
