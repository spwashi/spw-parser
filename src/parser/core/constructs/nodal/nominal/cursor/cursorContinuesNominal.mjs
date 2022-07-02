import {cursorStartsNominal} from "./cursorStartsNominal.mjs";

export function cursorContinuesNominal(char) {
  if (!char) return false;
  return cursorStartsNominal(char) || (char === '_');
}