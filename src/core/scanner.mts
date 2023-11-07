import {CharacterCursor} from './node/cursor.mjs';


export class Scanner {
  #lens;

  constructor(lens) {
    this.#lens = lens;
  }

  * scan(input) {
    let error: any = undefined;
    let prevCursor = undefined;
    let cursor     = this.#lens.getCursor(input);

    yield* cursor.log({message: 'beginning loop'});

    while (cursor.curr()) {
      cursor = yield* cursor.scan();

      if (!cursor) {
        yield {
          error:   true,
          message: 'did not generate a token',
        };
        break;
      }

      try {
        prevCursor = yield* Scanner.#checkCursor(cursor, prevCursor);
      } catch (e) {
        cursor = false;
        error  = e;
        break;
      }
    }

    if (cursor) {
      yield* Scanner.#handleSuccess(cursor);
      return cursor.getToken();
    }

    yield* Scanner.#handleError(error);
    return false;
  }

  static* #handleError(error) {
    yield {
      success: false,
      error:   true,
      message: {
        error,
      },
    };
    yield false;
  }

  static* #handleSuccess(cursor) {
    yield* cursor.log({
                        success: true,
                        message: 'ending loop',
                      });
    yield cursor.getToken();
  }

  getCursor(input) {
    return new CharacterCursor({input});
  }

  static* #checkCursor(cursor, prevCursor) {
    const currentToken = cursor ? cursor.getToken() : null;

    if (!currentToken && prevCursor) {
      yield* cursor.log({
                          error:   true,
                          message: 'token stream broke',
                          info:    {currentToken, prevCursor},
                        });
      throw new Error('token stream broke');
    }

    if (prevCursor?.offset === cursor.offset) {
      yield* cursor.log({
                          error:   true,
                          message: 'cursor did not change positions',
                        });
      throw new Error('token stream broke')
    }
    return cursor;
  }
}