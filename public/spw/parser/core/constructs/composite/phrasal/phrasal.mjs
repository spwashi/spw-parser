import {isPhrasalDelimiter}       from "./checks/cursor/isPhrasalDelimiter.mjs";
import {permittedConstituents}    from "./components/components.mjs";
import {movePastPhrasalDelimiter} from "./util/movePastPhrasalDelimiter.mjs";

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
      yield '--beginning phrasal--;'
    }

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
  yield '--exiting phrasal--';
  return {type: 'phrasal', token: tok};
}

