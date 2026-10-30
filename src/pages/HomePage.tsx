import { Icon } from "../components/ui/Icon";
import { Footer } from "../components/layout/Footer";
import { TravelSearch } from "../components/search/TravelSearch";
import { useTravel } from "../services/TravelStore";
import { navigate } from "../utils/navigation";
import hero from "../imagenes/hero-santorini.png";

export function HomePage() {
  const { criteria, setCriteria } = useTravel();
  const destinations: [string, string, string][] = [
    ["Europa", "Historia, cultura y paisajes únicos", "paris"],
    ["Caribe", "Playas de ensueño y aguas cristalinas", "cancun"],
    ["Estados Unidos", "Ciudades icónicas y naturaleza imponente", "newyork"],
    ["América del Sur", "Aventuras inolvidables muy cerca", "punta"],
  ];
  const pickDestination = (name: string) => {
    const code: Record<string, string> = {
      Europa: "París (CDG)",
      Caribe: "Cancún (CUN)",
      "Estados Unidos": "Nueva York (JFK)",
      "América del Sur": "Punta Cana (PUJ)",
    };
    setCriteria({ ...criteria, destination: code[name] });
    navigate("/paquetes");
  };
  return (
    <>
      <section
        className="home-hero"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="hero-shade"></div>
        <div className="hero-copy">
          <p className="eyebrow">EXPLORÁ EL MUNDO</p>
          <h1>
            Viajes que
            <br />
            se viven de verdad
          </h1>
          <p className="lead">
            Vuelos, hoteles, experiencias y asistencia en un solo lugar.
            <br />
            Planificá, compará y reservá tu próxima aventura de forma simple y
            segura.
          </p>
        </div>
      </section>
      <main className="home-main">
        <TravelSearch />
        <section className="benefits">
          {[
            ["⬟", "Todo en un solo lugar", "Vuelos, hoteles y más"],
            ["▣", "Pagos seguros", "Protección en cada reserva"],
            ["◷", "Atención 24/7", "Te acompañamos siempre"],
            ["♧", "Experiencias únicas", "Viajes diseñados para vos"],
          ].map(([icon, title, text], i) => (
            <article className={`benefit b${i}`} key={title}>
              <Icon>{icon}</Icon>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </section>
        <section className="section-heading">
          <div>
            <h2>Destinos que inspiran</h2>
          </div>
        </section>
        <section className="destinations">
          {destinations.map(([name, country, image]) => (
            <button
              className={`destination ${image}`}
              key={name}
              onClick={() => pickDestination(name)}
            >
              <div>
                <h3>{name}</h3>
                <p>{country}</p>
              </div>
              <span>
                <b>→</b>
              </span>
            </button>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
