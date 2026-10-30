import type { Route } from "../../utils/navigation";
import { navigate } from "../../utils/navigation";
import { Icon } from "../ui/Icon";
import { Logo } from "./Logo";

export function Navbar({ route }: { route: Route }) {
  const nav = [
    ["/", "Destinos"],
    ["/paquetes", "Paquetes"],
    ["/paquetes", "Hoteles"],
    ["/paquetes", "Experiencias"],
    ["/asistencia", "Asistencia"],
  ] as const;
  return (
    <header className="navbar">
      <Logo />
      <nav aria-label="Navegación principal">
        {nav.map(([path, label]) => (
          <button
            className={route === path ? "active" : ""}
            key={`${path}-${label}`}
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="nav-actions">
        <button className="plain-icon" aria-label="Buscar">
          <Icon>⌕</Icon>
        </button>
        <i></i>
        <button className="account" onClick={() => navigate("/mis-viajes")}>
          <Icon>◉</Icon>
          <span>
            {route === "/mis-viajes" ? (
              <>
                Hola, Laura<small>Mi cuenta</small>
              </>
            ) : (
              "Iniciar sesión"
            )}
          </span>
        </button>
        <button className="primary small" onClick={() => navigate("/checkout")}>
          Crear cuenta
        </button>
      </div>
    </header>
  );
}
