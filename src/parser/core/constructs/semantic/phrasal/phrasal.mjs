import {isPhrasalDelimiter}    from "./checks/cursor/isPhrasalDelimiter.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "./motions/movePastSpaces.mjs";
import {Cursor}                from "../../../cursor.mjs";
import {_debug}                from "../../../constants.mjs";

export function* phrasal(start, prev) {
  if (!prev) {
    _debug && (yield '[not phrasal: no head]');
    return false;
  }

  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'phrasal'});

  const {head, body, tail, operators} = yield* bodyLoop(cursor, prev);

  if (!tail) {
    _debug && (yield '[not phrasal: missing tail]');

    return prev ?? false;
  }

  _debug && (yield '--exiting phrasal--');

  cursor.token({
                 key:  [head?.key, body?.map(n => n?.key), tail?.key].join(' '),
                 head: head,
                 body: body,
                 tail: tail,
                 operators
               });

  return cursor;
}

function* bodyLoop(cursor, prev) {
  const head      = prev && prev.token();
  const body      = [];
  const operators = [];
  let started     = false;
  while (isPhrasalDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      _debug && (yield '--beginning phrasal--;');
    }

    const operator = yield* movePastSpaces(cursor);
    operators.push(operator);

    yield* movePastSpaces(cursor);
    const _cursor = yield* cursor.scan(permittedConstituents);
    const token   = _cursor ? _cursor.token() : null;
    if (!token) break;
    body.push(token);
  }

  const tail = body.pop();
  return {
    head:      head,
    body:      body,
    tail:      tail,
    operators: operators,
  };
}