import {isOrdinalDelimiter}    from "./checks/cursor/isOrdinalDelimiter.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "../phrasal/motions/movePastSpaces.mjs";

export function* ordinal(cursor, activeTok) {
  if (!activeTok) {
    yield '[passing ordinal]';
    return false;
  }

  let body    = [activeTok];
  let started = false;
  let curr    = cursor.pos().offset;
  while (isOrdinalDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      yield '--beginning ordinal--;'
    }

    cursor.advance();

    yield* movePastSpaces(cursor);

    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    if (!token) break;
    yield token;

    body.push(token);
  }

  if (body.length === 1) {
    return curr !== cursor.pos().offset ? false : activeTok;
  }
  yield '--exiting ordinal--';
  return {
    kind: 'ordinal',
    body: body
  };
}

