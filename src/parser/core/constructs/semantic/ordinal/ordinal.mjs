import {isOrdinalDelimiter}         from "./checks/cursor/isOrdinalDelimiter.mjs";
import {permittedConstituents}      from "./components/components.mjs";
import {movePastSpaces}             from "../phrasal/motions/movePastSpaces.mjs";
import {ordinalDelimitingOperators} from "../../pragmatic/operational/operators/operators.mjs";
import {Cursor}                     from "../../../cursor.mjs";
import {_debug}                     from "../../../constants.mjs";
import {buildOperator}              from "../../pragmatic/operational/buildOperator.mjs";

export function* ordinal(start, prev) {
  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'ordinal'});

  const {head, body, tail, operators} = yield* bodyLoop(cursor, prev);

  if (!operators.length) {
    _debug && (yield {
      message: 'not ordinal',
      miss:    'no operators'
    })
    return prev ?? false;
  }

  _debug && (yield {message: 'resolving ordinal'});

  cursor.token({
                 head:      head,
                 body:      body,
                 tail:      tail,
                 operators: operators,
               });

  return cursor;
}

function* bodyLoop(cursor, prev) {
  yield* movePastSpaces(cursor);
  const head      = prev && prev.token();
  const body      = [];
  const operators = [];
  let started     = false;
  while (isOrdinalDelimiter(cursor)) {
    if ((!started) && (started = true)) _debug && (yield {message: 'beginning ordinal'});
    yield* movePastSpaces(cursor);

    const operatorScanner = yield* cursor.scan([buildOperator(ordinalDelimitingOperators)]);
    const operator        = operatorScanner?.token();
    if (!operator) break;
    operators.push(operator);

    yield* movePastSpaces(cursor);
    const bodyScanner = yield* cursor.scan(permittedConstituents);
    let token         = bodyScanner ? bodyScanner.token() : null;
    if (!token) { token = null}
    body.push(token);
    yield* movePastSpaces(cursor);
  }

  const tail = body.pop();
  return {
    head:      head,
    body:      body,
    tail:      tail,
    operators: operators,
  };
}