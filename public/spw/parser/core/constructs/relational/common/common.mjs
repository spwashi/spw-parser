import {isCommonDelimiter}     from "./checks/cursor/isCommonDelimiter.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "../phrasal/motions/movePastSpaces.mjs";

export function* common(cursor, activeTok) {
  if (!activeTok) {
    yield '[passing common]';
    return false;
  }

  let body     = [activeTok];
  let started = false;
  let curr    = cursor.pos().offset;
  while (isCommonDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      yield '--beginning common--;'
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
  yield '--exiting common--';
  return {
    kind: 'common',
    body: body,
  };
}

