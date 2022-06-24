import {nominal}            from "../../basic/nominal/nominal.mjs";
import {numeric}            from "../../basic/numeric/numeric.mjs";
import {isPhrasalDelimiter} from "./checks/char/isPhrasalDelimiter.mjs";

export function* phrasal(cursor, activeTok) {
  if (!activeTok) {
    yield '[passing phrasal]';
    return false;
  }

  let tok     = [activeTok];
  let started = false;
  let curr    = cursor.pos().offset;
  while (isPhrasalDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      yield '--beginning phrase--;'
    }

    yield* advanceCursorBeyondPhrasalDelimiter(cursor);

    let token = false;
    for (let generator of [nominal, numeric]) {
      token = yield* generator(cursor, token);
    }
    if (!token) break;
    tok.push(token)
  }

  if (tok.length === 1) {
    return curr !== cursor.pos().offset ? false : activeTok;
  }
  yield '--exiting phrase--';
  return {type: 'phrase', token: tok};
}

function* advanceCursorBeyondPhrasalDelimiter(cursor) {
  while (isPhrasalDelimiter(cursor)) {
    yield cursor.pos();
    cursor.advance();
  }
}
