import {isPhrasalDelimiter}       from "./checks/cursor/isPhrasalDelimiter.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "./motions/movePastSpaces.mjs";

export function* phrasal(cursor, activeTok) {
  if (!activeTok) {
    yield '[passing phrasal]';
    return false;
  }

  let tok         = [activeTok];
  let started     = false;
  let startOffset = cursor.pos().offset;
  while (isPhrasalDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      yield '--beginning phrasal--;'
    }

    yield* movePastSpaces(cursor);

    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    if (!token) break;
    yield token;

    tok.push(token);
  }

  if (tok.length === 1) {
    cursor.reset(startOffset);
    return activeTok;
  }
  yield '--exiting phrasal--';
  return {kind: 'phrasal', token: tok};
}

