import {isCommonDelimiter}         from "./checks/cursor/isCommonDelimiter.mjs";
import {permittedConstituents}     from "./components/components.mjs";
import {movePastSpaces}            from "../phrasal/motions/movePastSpaces.mjs";
import {Cursor}                    from "../../../cursor.mjs";
import {commonDelimitingOperators} from "../../pragmatic/operational/operators/operators.mjs";
import {_debug}                    from "../../../constants.mjs";
import {delimiter}                 from "../../pragmatic/operational/delimiter.mjs";

export function* common(start, prev) {
  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'common'});

  const {head, body, tail, operators} = yield* bodyLoop(cursor, prev);

  if (!operators.length) {
    return prev ?? false;
  }

  _debug && (yield '--exiting common--');

  cursor.token({
                 key:       [head?.key, ...body?.map((n) => n?.key) || [], tail?.key].join(' , '),
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
    if ((!started) && (started = true)) {
      _debug && (yield '--beginning common--;');
    }
    yield* movePastSpaces(cursor);

    const operator = yield* cursor.scan([delimiter(commonDelimitingOperators)]);
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