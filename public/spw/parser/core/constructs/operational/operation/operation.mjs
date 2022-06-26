import {isOperator}               from "./checks/cursor/isOperator.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "../../relational/phrasal/motions/movePastSpaces.mjs";

export function* operation(cursor, activeTok) {
  if (!activeTok) {
    yield '[passing operational]';
    return false;
  }

  let tok         = [activeTok];
  let started     = false;
  let startOffset = cursor.pos().offset;
  yield* movePastSpaces(cursor);
  while (isOperator(cursor)) {
    if ((!started) && (started = true)) {
      yield '--beginning operational--;'
    }
    cursor.advance();
    yield* movePastSpaces(cursor);
    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    yield* movePastSpaces(cursor);
    if (!token) break;
    yield token;

    tok.push(token);
  }

  if (tok.length === 1) {
    cursor.reset(startOffset);
    return activeTok;
  }
  yield '--exiting operational--';
  return {kind: 'operational', operands: tok};
}

