import {isPhrasalDelimiter}    from "./checks/cursor/isPhrasalDelimiter.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "./motions/movePastSpaces.mjs";
import {Cursor}                from "../../../cursor.mjs";
import {_debug}                from "../../../constants.mjs";

export function* phrasal(start, prev) {
  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'phrasal'});

  if (!prev) {
    _debug && (yield {
      message: 'not phrasal',
      miss:    'no head',
      cursors: {start, prev}
    });
    return false;
  }

  const {head, body, tail, operators} = yield* bodyLoop(cursor, prev);

  if (!tail) {
    _debug && (yield {
      message: 'not phrasal',
      miss:    'no tail',
      cursors: {start, prev, cursor},
      info:    {
        head,
        body,
        tail,
        operators,
      }
    });

    return prev ?? false;
  }

  _debug && (yield {
    message: 'resolving phrasal',
  });

  cursor.token({
                 head:      head,
                 body:      body,
                 tail:      tail,
                 operators: operators
               });

  return cursor;
}

function* bodyLoop(cursor, prev) {
  const head      = prev && prev.token();
  const body      = [];
  const operators = [];
  let started     = false;
  while (isPhrasalDelimiter(cursor)) {
    if ((!started) && (started = true)) _debug && (yield {message: 'beginning ordinal'});

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