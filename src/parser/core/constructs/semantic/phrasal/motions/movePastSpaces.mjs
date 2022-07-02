import {isPhrasalDelimiter} from "../checks/cursor/isPhrasalDelimiter.mjs";

export function* movePastSpaces(cursor) {
  const spaces = [];
  while (isPhrasalDelimiter(cursor)) {
    yield cursor.pos();
    spaces.push(cursor.pos());
    cursor.advance();
  }
  return spaces;
}