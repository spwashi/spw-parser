import {isPhrasalDelimiter} from "../checks/cursor/isPhrasalDelimiter.mjs";

export function* movePastPhrasalDelimiter(cursor) {
  while (isPhrasalDelimiter(cursor)) {
    yield cursor.pos();
    cursor.advance();
  }
}