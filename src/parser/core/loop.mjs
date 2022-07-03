import {allConstructs} from "./constructs/constructs.mjs";

function* checkCursor(cursor, prevCursor) {
  const currentToken = cursor ? cursor.token() : null;

  if (!currentToken && prevCursor) {
    yield* cursor.log({
                        error:   true,
                        message: 'token stream broke',
                        info:    {currentToken, prevCursor}
                      });
    throw new Error("token stream broke");
  }

  if (prevCursor?.offset === cursor.offset) {
    yield* cursor.log({
                        error:   true,
                        message: 'cursor did not change positions'
                      });
    throw new Error("token stream broke")
  }
  return cursor;
}

export function* loopGenerators(start, generators = Object.values(allConstructs)) {
  let cursor = start;
  let error  = undefined;
  yield* cursor.log({message: 'beginning loop'});

  let prevCursor = undefined;
  while (cursor.curr()) {
    cursor = yield* cursor.scan(generators);

    if (!cursor) {
      yield {
        error:   true,
        message: 'did not generate a token'
      };
      break;
    }

    try {
      prevCursor = yield* checkCursor(cursor, prevCursor);
    } catch (e) {
      cursor = false;
      error  = e;
      break;
    }
  }

  if (cursor) {
    yield* cursor.log({
                        success: true,
                        message: 'ending loop',
                      });
    yield cursor.token();
    return cursor.token();
  } else {
    yield {
      success: false,
      error:   true,
      message: {
        error
      }
    };
    yield false;
    return false;
  }
}