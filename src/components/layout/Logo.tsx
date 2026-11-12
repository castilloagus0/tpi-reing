import { Globe2 } from "lucide-react";
import { navigate } from "../../utils/navigation";

export function Logo() {
  return (
    <button type="button" className="logo" onClick={() => navigate("/")} aria-label="MundoGlobal, ir al inicio">
      <span className="logo__mark" aria-hidden="true">
        <Globe2 />
      </span>
      <span className="logo__word" aria-hidden="true">
        MundoGlobal
      </span>
    </button>
  );
}
