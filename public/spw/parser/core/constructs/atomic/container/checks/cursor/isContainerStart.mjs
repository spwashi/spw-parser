import {containerDelimiterMap} from "../../util/containerDelimiterMap.mjs";

export function isContainerStart(cursor) {
  const char = cursor.curr();
  if (!char) return false;
  return !!containerDelimiterMap[char];
}