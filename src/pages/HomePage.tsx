import { ArrowUpRight, Headphones, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { TravelSearch } from "../components/search/TravelSearch";
import heroLarge from "../imagenes/hero-santorini.webp";
import heroSmall from "../imagenes/hero-santorini-sm.webp";
import { getDestinationImage } from "../mocks/media";
import { useTravel } from "../services/TravelStore";
import { navigate } from "../utils/navigation";

const DESTINATIONS = [
  { name: "Europa", text: "Historia, cultura y paisajes únicos", image: "paris", code: "París (CDG)" },
  { name: "Caribe", text: "Playas de ensueño y aguas cristalinas", image: "cancun", code: "Cancún (CUN)" },
  { name: "Estados Unidos", text: "Ciudades icónicas y naturaleza", image: "nueva-york", code: "Nueva York (JFK)" },
  { name: "América del Sur", text: "Aventuras inolvidables muy cerca", image: "buenos-aires", code: "Punta Cana (PUJ)" },
];

const BENEFITS = [
  { icon: Layers, title: "Todo en un solo lugar", text: "Vuelos, hoteles y asistencia" },
  { icon: ShieldCheck, title: "Pagos seguros", text: "Protección en cada reserva" },
  { icon: Headphones, title: "Atención 24/7", text: "Personas reales, siempre" },
  { icon: Sparkles, title: "Experiencias únicas", text: "Viajes diseñados para vos" },
];

export function HomePage() {
  const { criteria, setCriteria } = useTravel();

  const pickDestination = (code: string) => {
    setCriteria({ ...criteria, destination: code });
    navigate("/paquetes");
  };

  return (
    <>
      <main id="main" className="page home" tabIndex={-1}>
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero__media">
            <img
              className="hero__img"
              src={heroLarge}
              srcSet={`${heroSmall} 980w, ${heroLarge} 1957w`}
              sizes="(min-width: 1280px) 1200px, 100vw"
              alt="Hotel con piscina infinita frente al mar Egeo al atardecer"
              width={1957}
              height={804}
              fetchPriority="high"
            />
            <div className="hero__shade" aria-hidden="true" />
            <div className="hero__copy">
              <p className="eyebrow hero__eyebrow">Explorá el mundo</p>
              <h1 id="hero-title" className="hero__title">
                Viajes que se viven de verdad
              </h1>
              <p className="hero__lead">
                Vuelos, hoteles, experiencias y asistencia en un solo lugar.
              </p>
            </div>
          </div>
          <div className="hero__search">
            <TravelSearch />
          </div>
        </section>

        <section className="container benefits" aria-label="Beneficios">
          <ul>
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="benefits__icon" aria-hidden="true">
                  <Icon />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="container" aria-labelledby="destinations-title">
          <div className="section-head">
            <div>
              <h2 id="destinations-title" className="section-head__title">
                Destinos que inspiran
              </h2>
              <p className="section-head__subtitle">Elegí una región y te mostramos paquetes.</p>
            </div>
          </div>
          <ul className="destinations">
            {DESTINATIONS.map((d) => {
              const image = getDestinationImage(d.image);
              return (
                <li key={d.name}>
                  <button type="button" className="destination" onClick={() => pickDestination(d.code)}>
                    <img src={image.medium} alt="" loading="lazy" width={640} height={800} />
                    <span className="destination__shade" aria-hidden="true" />
                    <span className="destination__text">
                      <strong>{d.name}</strong>
                      <small>{d.text}</small>
                    </span>
                    <span className="destination__arrow" aria-hidden="true">
                      <ArrowUpRight />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
