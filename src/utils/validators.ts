import type { SearchCriteria, Traveller } from "../models";

export function isSearchCriteriaValid(criteria: SearchCriteria): boolean {
  return Boolean(
    criteria.origin &&
      criteria.destination &&
      criteria.departure &&
      criteria.returnDate &&
      criteria.returnDate > criteria.departure,
  );
}

export function hasValidCheckoutData(
  travellers: Traveller[],
  email: string,
  phone: string,
): boolean {
  return (
    travellers.every(
      (traveller) =>
        traveller.name &&
        traveller.surname &&
        traveller.birthDate &&
        traveller.nationality &&
        traveller.document,
    ) &&
    /^\S+@\S+\.\S+$/.test(email) &&
    phone.length >= 8
  );
}
