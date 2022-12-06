import {beginsNominal} from "./beginsNominal.mts";

export function continuesNominal(char) {
  if (!char) return false;
  return beginsNominal(char) || (char === '_');
}