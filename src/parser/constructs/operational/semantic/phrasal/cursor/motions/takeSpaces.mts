import {isPhrasalDelimiter} from '../checks/isPhrasalDelimiter.mjs';

export function* takeSpaces(cursor) {
  const spaces: any[] = [];
  while (isPhrasalDelimiter(cursor)) {
    spaces.push({key: cursor.curr()});
    yield* cursor.take();
  }
  return spaces;
}