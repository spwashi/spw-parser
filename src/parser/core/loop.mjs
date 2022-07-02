import {allConstructs} from "./constructs/constructs.mjs";
import {_debug}        from "./constants.mjs";

export function* loopGenerators(start, generators = Object.values(allConstructs)) {
  _debug && (yield {
    message: '--looping--'
  });

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
      _debug && (yield {
        message: '[cursor did not change positions]'
      });
      cursor = false;
      break;
    }

    prevCursor = cursor;
  }

  _debug && (yield {
    message: '--looped--'
  });

  if (cursor) yield cursor.token();
  else yield false;
}