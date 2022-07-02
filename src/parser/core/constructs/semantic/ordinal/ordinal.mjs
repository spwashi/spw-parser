import {isOrdinalDelimiter}         from "./checks/cursor/isOrdinalDelimiter.mjs";
import {permittedConstituents}      from "./components/components.mjs";
import {movePastSpaces}             from "../phrasal/motions/movePastSpaces.mjs";
import {ordinalDelimitingOperators} from "../../pragmatic/operational/operators/operators.mjs";
import {Cursor}                     from "../../../cursor.mjs";
import {_debug}                     from "../../../constants.mjs";
import {delimiter}                  from "../../pragmatic/operational/delimiter.mjs";

export function* ordinal(start, prev) {
  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'ordinal'});

  const {head, body, tail, operators} = yield* bodyLoop(cursor, prev);

  if (!operators.length) {
    return prev ?? false;
  }

  _debug && (yield '--exiting ordinal--');

  cursor.token({
                 key:       [head?.key, ...body?.map((n) => n?.key) || [], tail?.key].join(' ; '),
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
  while (isOrdinalDelimiter(cursor, head)) {
    if ((!started) && (started = true)) {
      _debug && (yield '--beginning ordinal--;');
    }
    yield* movePastSpaces(cursor);

    const operator = yield* cursor.scan([delimiter(ordinalDelimitingOperators)]);
    operators.push(operator);

    yield* movePastSpaces(cursor);
    const _cursor = yield* cursor.scan(permittedConstituents);
    let token     = _cursor ? _cursor.token() : null;
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