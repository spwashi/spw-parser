import {isOrdinalDelimiter}         from "./checks/cursor/isOrdinalDelimiter.mjs";
import {permittedConstituents}      from "./components/components.mjs";
import {movePastSpaces}             from "../phrasal/motions/movePastSpaces.mjs";
import {operational}                from "../../operational/operational.mjs";
import {ordinalDelimitingOperators} from "../../operational/operators/operators.mjs";
import {Cursor}                     from "../../../cursor.mjs";

export function* ordinal(startingCursor, activeTok) {
  if (!activeTok) {
    yield '[passing ordinal]';
    return false;
  }

  const cursor = new Cursor(startingCursor);
  const curr   = cursor.pos().offset;
  cursor.token({kind: 'ordinal'});
  const {body, operators} = yield* bodyLoop(cursor, activeTok);

  if (body.length === 1) {
    return curr !== cursor.pos().offset ? false : activeTok;
  }

  startingCursor.setOffset(cursor.offset);

  yield '--exiting ordinal--';

  return cursor.token({
                        operators: operators,
                        body:      body.length ? body : undefined,
                      });
}

function* bodyLoop(cursor, activeTok) {
  const body      = [activeTok];
  const operators = [];
  let started     = false;
  while (isOrdinalDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      yield '--beginning ordinal--;'
    }

    const operator = yield* operational(cursor, null, ordinalDelimitingOperators);
    operators.push(operator);
    yield* movePastSpaces(cursor);

    let token = false;
    for (const generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    if (!token) break;
    yield token;

    body.push(token);
  }
  return {body, operators};
}
