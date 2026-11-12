import { Lock } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <Logo />
        <p className="site-footer__text">
          © 2026 MundoGlobal Travel · Prototipo educativo de servicio digital
        </p>
        <p className="site-footer__trust">
          <Lock aria-hidden="true" />
          Pago seguro · Asistencia 24/7
        </p>
      </div>
    </footer>
  );
}
