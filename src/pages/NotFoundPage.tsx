import { ArrowRight, Compass } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { navigate } from "../utils/navigation";

export function NotFoundPage() {
  return (
    <>
      <main id="main" className="page container page--center" tabIndex={-1}>
        <EmptyState
          titleAs="h1"
          icon={<Compass />}
          title="Esta página no existe"
          text="Puede que el enlace esté mal escrito o que la página se haya movido."
          action={
            <Button trailingIcon={<ArrowRight aria-hidden="true" />} onClick={() => navigate("/")}>
              Volver al inicio
            </Button>
          }
        />
      </main>
      <Footer />
    </>
  );
}
