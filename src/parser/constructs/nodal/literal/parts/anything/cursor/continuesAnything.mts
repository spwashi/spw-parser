import {beginsAnything} from "./beginsAnything.mts";

export function continuesAnything(char) {
  if (!char) return false;
  return beginsAnything(char) || (char === '_');
}