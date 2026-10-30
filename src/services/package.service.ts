import { packagesMock } from "../mocks/catalog";
import type { TravelPackage } from "../models";

/** Boundary ready to be replaced with an HTTP repository. */
export function getAvailablePackages(): TravelPackage[] {
  return packagesMock;
}
