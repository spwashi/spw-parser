import {containerDelimiterMap} from "../util/containerDelimiterMap.mjs";

export function cursorStartsContainer(cursor) {
  const char = cursor.curr();
  if (!char) return false;
  return !!containerDelimiterMap[char];
}