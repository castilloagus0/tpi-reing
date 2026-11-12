import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";

interface State {
  error: Error | null;
}

/** Estado de error de último recurso para toda la app. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main id="main" className="page container page--center" tabIndex={-1}>
        <EmptyState
          titleAs="h1"
          icon={<AlertTriangle />}
          title="Algo salió mal"
          text="No pudimos mostrar esta pantalla. Probá recargar; tus reservas siguen guardadas."
          action={
            <Button leadingIcon={<RotateCcw aria-hidden="true" />} onClick={() => window.location.reload()}>
              Recargar
            </Button>
          }
        />
      </main>
    );
  }
}
