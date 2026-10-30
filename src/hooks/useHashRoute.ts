import { useEffect, useState } from "react";
import type { Route } from "../utils/navigation";

function currentRoute(): Route {
  return (window.location.hash.split("?")[0].replace("#", "") || "/") as Route;
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(currentRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(currentRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}
