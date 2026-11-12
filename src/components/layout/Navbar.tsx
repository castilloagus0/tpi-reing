import { Menu } from "lucide-react";
import { useState } from "react";
import { useTravel } from "../../services/TravelStore";
import { cx } from "../../utils/cx";
import { navigate, type Route } from "../../utils/navigation";
import { Avatar } from "../ui/Avatar";
import { Drawer } from "../ui/Dialog";
import { IconButton } from "../ui/IconButton";
import { Logo } from "./Logo";

const NAV: Array<{ path: Route; label: string; match: Route[] }> = [
  { path: "/", label: "Inicio", match: ["/"] },
  { path: "/paquetes", label: "Paquetes", match: ["/paquetes", "/checkout"] },
  { path: "/mis-viajes", label: "Mis viajes", match: ["/mis-viajes"] },
  { path: "/asistencia", label: "Ayuda", match: ["/asistencia", "/asistente-viaje"] },
];

export function Navbar({ route }: { route: Route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { bookings } = useTravel();
  const user = bookings[0]?.travellers[0];
  const userName = user ? `${user.name} ${user.surname}` : "Mi cuenta";

  const go = (path: Route) => {
    setMenuOpen(false);
    navigate(path);
  };

  const links = (variant: "bar" | "drawer") =>
    NAV.map((item) => {
      const active = item.match.includes(route);
      return (
        <li key={item.path}>
          <button
            type="button"
            className={cx("nav-link", `nav-link--${variant}`, active && "is-active")}
            aria-current={active ? "page" : undefined}
            onClick={() => go(item.path)}
          >
            {item.label}
          </button>
        </li>
      );
    });

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Logo />
        <nav aria-label="Principal" className="site-nav">
          <ul>{links("bar")}</ul>
        </nav>
        <button type="button" className="account-chip" onClick={() => go("/mis-viajes")}>
          <Avatar name={userName} size="sm" />
          <span className="account-chip__text">
            {user?.name ?? "Mi cuenta"}
            <small>Mi cuenta</small>
          </span>
        </button>
        <IconButton
          className="site-header__menu"
          label="Abrir menú"
          icon={<Menu />}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        />
      </div>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menú">
        <nav aria-label="Principal (móvil)">
          <ul className="drawer-nav">{links("drawer")}</ul>
        </nav>
        <button type="button" className="account-chip account-chip--drawer" onClick={() => go("/mis-viajes")}>
          <Avatar name={userName} />
          <span className="account-chip__text">
            {userName}
            <small>Ver mis viajes</small>
          </span>
        </button>
      </Drawer>
    </header>
  );
}
