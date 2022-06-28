import {getOperatorType}       from "./checks/cursor/getOperatorType.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "../relational/phrasal/motions/movePastSpaces.mjs";
import {readLabel}             from "../../motions/readLabel.mjs";
import {pragmaticOperators}    from "./operators/operators.mjs";
import {Cursor}                from "../../cursor.mjs";

export function* operational(startingCursor, activeTok, permittedOperators = pragmaticOperators) {
  let body     = [];
  let prev;
  let started  = false;
  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'operational',});
  yield* movePastSpaces(cursor);
  let opType, origOpType;
  let label;
  const operators = [];
  while ((opType = getOperatorType(cursor, permittedOperators))) {
    if ((!started) && (started = true)) {
      origOpType = opType;
      cursor.token({prototype: origOpType})
      yield '--beginning operational--;'
    }

    prev && body.push(prev);
    operators.push(cursor.pos());
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

  if (origOpType?.kind === 'delimiter') {
    startingCursor.setOffset(cursor.offset);
    return cursor.token();
  }

  if (!prev) {
    yield '[not operational]';
    return activeTok || false;
  }
  startingCursor.setOffset(cursor.offset);

  yield '--exiting operational--';

  return cursor.token({
                        head: activeTok ? activeTok : undefined,
                        body: body.length ? body : undefined,
                        tail: prev ? prev : undefined,
                      })
}

