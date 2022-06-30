import {isOrdinalDelimiter}         from "./checks/cursor/isOrdinalDelimiter.mjs";
import {permittedConstituents}      from "./components/components.mjs";
import {movePastSpaces}             from "../phrasal/motions/movePastSpaces.mjs";
import {operational}                from "../../pragmatic/operational/operational.mjs";
import {ordinalDelimitingOperators} from "../../pragmatic/operational/operators/operators.mjs";
import {Cursor}                     from "../../../cursor.mjs";
import {_debug}                     from "../../../constants.mjs";

export function* ordinal(startingCursor, activeTok) {
  if (activeTok === false) return false;
  const cursor = new Cursor(startingCursor);
  yield* movePastSpaces(cursor);
  const curr = cursor.pos().offset;
  cursor.token({kind: 'ordinal'});
  const {head, body, operators, tail} = yield* bodyLoop(cursor, activeTok);

  if (tail === false) {
    return curr !== cursor.pos().offset ? false : activeTok;
  }

  startingCursor.setOffset(cursor.offset);

  _debug && (yield '--exiting ordinal--');

  return cursor.token({
                        operators: operators,
                        head:      head,
                        body:      body.length ? body : undefined,
                        tail
                      });
}

function* bodyLoop(cursor, head) {
  const body      = [];
  const operators = [];
  let started     = false;
  let tail        = false;
  while (isOrdinalDelimiter(cursor, head)) {
    if ((!started) && (started = true)) {
      _debug && (yield '--beginning ordinal--;');
    }

    (tail !== false) && body.push(tail);

    yield* movePastSpaces(cursor);

    const operator = yield* operational(cursor, null, ordinalDelimitingOperators);
    operators.push(operator);
    yield* movePastSpaces(cursor);

    let token = false;
    for (const generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    if (!token) {
      token = null;
    }
    yield token;

    yield* movePastSpaces(cursor);

    tail = token;
  }

  return {
    head,
    body:      body,
    operators: operators,
    tail:      tail,
  };
}
