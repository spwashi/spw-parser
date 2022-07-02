import {allConstructs} from "./constructs/constructs.mjs";
import {_debug}        from "./constants.mjs";

export function* loopGenerators(start, generators = Object.values(allConstructs)) {
  _debug && (yield {message: 'beginning loop'});

  let prevCursor;
  let cursor = start;
  while (cursor.curr()) {
    cursor = yield* cursor.scan(generators);

    if (!cursor) {
      _debug && (yield {
        error:   true,
        message: 'did not generate a token'
      });
      break;
    }

    const currentToken = cursor ? cursor.token() : null;

    if (!currentToken && prevCursor) {
      _debug && (yield {
        error:   true,
        message: 'token stream broke',
        info:    {currentToken, prevCursor}
      });
      cursor = false;
      break;
    }

    if (prevCursor?.offset === cursor.offset) {
      _debug && (yield {
        error:   true,
        message: 'cursor did not change positions'
      });
      cursor = false;
      break;
    }

    prevCursor = cursor;
  }


  if (cursor) {
    _debug && (yield {
      success: true,
      message: 'ending loop',
    });
    yield cursor.token();
    return cursor.token();
  } else {
    yield false;
    return false;
  }
}