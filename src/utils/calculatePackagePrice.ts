import type { TravelPackage } from "../models";

export const PACKAGE_TAXES = 210;

export function calculatePackagePrice(pkg: TravelPackage): number {
  return pkg.flightPrice + pkg.hotelPrice + pkg.assistancePrice + PACKAGE_TAXES;
}
