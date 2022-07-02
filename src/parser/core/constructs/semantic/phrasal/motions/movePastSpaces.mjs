import {isPhrasalDelimiter} from "../checks/cursor/isPhrasalDelimiter.mjs";

export function* movePastSpaces(cursor) {
  const spaces = [];
  while (isPhrasalDelimiter(cursor)) {
    const char = yield* cursor.take();
    spaces.push(char);
  }
  return spaces;
}