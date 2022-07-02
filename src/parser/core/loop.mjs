import {allConstructs} from "./constructs/constructs.mjs";
import {_debug}        from "./constants.mjs";

export function* loopGenerators(start, generators = Object.values(allConstructs)) {
  _debug && (yield '--looping--');

  let prevCursor;
  let cursor = start;
  while (cursor.curr()) {
    cursor = yield* cursor.scan(generators);

    if (!cursor) {
      break;
    }

    const currentToken = cursor ? cursor.token() : null;

    if (!currentToken && prevCursor) {
      cursor = false;
      break;
    }

    if (prevCursor?.offset === cursor.offset) {
      _debug && (yield '[cursor did not change positions]');
      cursor = false;
      break;
    }

    prevCursor = cursor;
  }

  _debug && (yield '--looped--');

  if (cursor) yield cursor.token();
  else yield false;
}