import { navigate } from "../../utils/navigation";

export function Logo() {
  return (
    <button
      className="logo"
      onClick={() => navigate("/")}
      aria-label="MundoGlobal, ir al inicio"
    >
      MundoGlobal
    </button>
  );
}
