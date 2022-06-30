import {getOperatorType}       from "./checks/cursor/getOperatorType.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "../../semantic/phrasal/motions/movePastSpaces.mjs";
import {readLabel}             from "../../../motions/readLabel.mjs";
import {pragmaticOperators}    from "./operators/operators.mjs";
import {Cursor}                from "../../../cursor.mjs";
import {_debug}                from "../../../constants.mjs";

export function* operational(startingCursor, activeTok, permittedOperators = pragmaticOperators) {
  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'operational',});

  let {body, prev, origOpType} = yield* bodyLoop(cursor, permittedOperators);

  if (origOpType?.kind === 'delimiter') {
    startingCursor.setOffset(cursor.offset);
    return cursor.token();
  }

  if (!prev) {
    _debug && (yield '[not operational]');
    return activeTok || false;
  }
  startingCursor.setOffset(cursor.offset);

  _debug && (yield '--exiting operational--');

  return cursor.token({
                        head: activeTok ? activeTok : undefined,
                        body: body.length ? body : undefined,
                        tail: prev ? prev : undefined,
                      })
}

function* bodyLoop(cursor, permittedOperators) {
  let body    = [];
  let prev;
  let started = false;

  yield* movePastSpaces(cursor);
  let opType, origOpType;
  let label;
  const operators = [];
  while ((opType = getOperatorType(cursor, permittedOperators))) {
    if ((!started) && (started = true)) {
      origOpType = opType;
      cursor.token({prototype: origOpType})
      _debug && (yield '--beginning operational--;');
    }

    prev && body.push(prev);
    operators.push(cursor.pos());
    yield cursor.pos();
    cursor.advance();

    label = yield* readLabel(cursor);

    if (opType.kind === 'delimiter') break;

    yield* movePastSpaces(cursor);
    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    yield* movePastSpaces(cursor);
    if (!token) break;
    yield token;
    prev = token;
  }

  cursor.token({operators: operators});
  if (label) cursor.token({label: label})
  return {body, prev, origOpType};
}

