import { useEffect } from "react";
import { LiveChatWidget } from "./components/chat/LiveChatWidget";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { Navbar } from "./components/layout/Navbar";
import { useHashRoute } from "./hooks/useHashRoute";
import { AssistancePage } from "./pages/AssistancePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { MyTripsPage } from "./pages/MyTripsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PackagesPage } from "./pages/PackagesPage";
import { TravelAssistantPage } from "./pages/TravelAssistantPage";
import type { Route } from "./utils/navigation";

const PAGES: Record<Route, () => React.JSX.Element> = {
  "/": HomePage,
  "/paquetes": PackagesPage,
  "/checkout": CheckoutPage,
  "/mis-viajes": MyTripsPage,
  "/asistencia": AssistancePage,
  "/asistente-viaje": TravelAssistantPage,
};

const TITLES: Record<Route, string> = {
  "/": "Inicio",
  "/paquetes": "Paquetes",
  "/checkout": "Reserva",
  "/mis-viajes": "Mis viajes",
  "/asistencia": "Centro de ayuda",
  "/asistente-viaje": "Asistencia al viaje",
};

function App() {
  const route = useHashRoute();
  const Page = PAGES[route] ?? NotFoundPage;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = `${TITLES[route] ?? "Página no encontrada"} · MundoGlobal`;
  }, [route]);

  return (
    <>
      {/* Botón y no <a href="#main">: el router usa el hash. */}
      <button
        type="button"
        className="skip-link"
        onClick={() => document.getElementById("main")?.focus()}
      >
        Saltar al contenido
      </button>
      <Navbar route={route} />
      <ErrorBoundary key={route}>
        <Page />
      </ErrorBoundary>
      <LiveChatWidget hideLauncher={route === "/asistente-viaje"} />
    </>
  );
}

export default App;
