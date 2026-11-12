import "./App.css";
import { Navbar } from "./components/layout/Navbar";
import { useHashRoute } from "./hooks/useHashRoute";
import { AssistancePage } from "./pages/AssistancePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { MyTripsPage } from "./pages/MyTripsPage";
import { PackagesPage } from "./pages/PackagesPage";
import { TravelAssistantPage } from "./pages/TravelAssistantPage";

function App() {
  const route = useHashRoute();

  return (
    <>
      <Navbar route={route} />
      {route === "/" && <HomePage />}
      {route === "/paquetes" && <PackagesPage />}
      {route === "/checkout" && <CheckoutPage />}
      {route === "/mis-viajes" && <MyTripsPage />}
      {route === "/asistencia" && <AssistancePage />}
      {route === "/asistente-viaje" && <TravelAssistantPage />}
    </>
  );
}

export default App;
