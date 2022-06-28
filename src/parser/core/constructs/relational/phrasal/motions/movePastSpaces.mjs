import {isPhrasalDelimiter} from "../checks/cursor/isPhrasalDelimiter.mjs";

export function* movePastSpaces(cursor) {
  while (isPhrasalDelimiter(cursor)) {
    yield cursor.pos();
    cursor.advance();
  }
}