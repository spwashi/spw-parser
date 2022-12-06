import {isPhrasalDelimiter} from "../checks/isPhrasalDelimiter.mts";

export function* takeSpaces(cursor) {
  const spaces = [];
  while (isPhrasalDelimiter(cursor)) {
    spaces.push({key: cursor.curr()});
    yield* cursor.take();
  }
  return spaces;
}