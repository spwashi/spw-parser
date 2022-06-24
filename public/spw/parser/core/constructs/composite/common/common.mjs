import {isCommonDelimiter}     from "./checks/cursor/isCommonDelimiter.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastPhrasalDelimiter} from "../phrasal/util/movePastPhrasalDelimiter.mjs";

export function* common(cursor, activeTok) {
  if (!activeTok) {
    yield '[passing common]';
    return false;
  }

  let tok     = [activeTok];
  let started = false;
  let curr    = cursor.pos().offset;
  while (isCommonDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      yield '--beginning common--;'
    }

    cursor.advance();

    yield* movePastPhrasalDelimiter(cursor);

    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    if (!token) break;
    yield token;

    tok.push(token);
  }

  if (tok.length === 1) {
    return curr !== cursor.pos().offset ? false : activeTok;
  }
  yield '--exiting common--';
  return {type: 'common', token: tok};
}

