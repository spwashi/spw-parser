import {isCommonDelimiter}         from "./checks/cursor/isCommonDelimiter.mjs";
import {permittedConstituents}     from "./components/components.mjs";
import {movePastSpaces}            from "../phrasal/motions/movePastSpaces.mjs";
import {Cursor}                    from "../../../cursor.mjs";
import {commonDelimitingOperators} from "../../pragmatic/operational/operators/operators.mjs";
import {_debug}                    from "../../../constants.mjs";
import {buildOperator}             from "../../pragmatic/operational/buildOperator.mjs";

export function* common(start, prev) {
  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'common'});

  const {head, body, tail, operators} = yield* bodyLoop(cursor, prev);

  if (!operators.length) {
    _debug && (yield {
      message: 'not common',
      miss:    'no operators'
    });
    return prev ?? false;
  }

  _debug && (yield {message: 'resolving common'});

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
  while (isCommonDelimiter(cursor)) {
    if ((!started) && (started = true)) _debug && (yield {message: 'beginning common'});
    yield* movePastSpaces(cursor);

    const operatorScanner = yield* cursor.scan([buildOperator(commonDelimitingOperators)]);
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