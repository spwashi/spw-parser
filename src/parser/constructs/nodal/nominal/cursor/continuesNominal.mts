import {beginsNominal} from "./beginsNominal.mjs";

export function continuesNominal(char) {
  if (!char) return false;
  return beginsNominal(char) || (char === '_') || /\d/.test(char);
}