import {isPhrasalDelimiter}    from "./checks/cursor/isPhrasalDelimiter.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces} from "./motions/movePastSpaces.mjs";
import {Cursor}         from "../../../cursor/cursor.mjs";

export function* phrasal(start, prev) {
  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'phrasal'});

  yield* cursor.log({message: 'checking phrasal'});

  if (!prev) {
    yield* cursor.log({
                        message: 'not phrasal',
                        miss:    'no head',
                        cursors: {start, prev}
                      });
    return false;
  }

  const {head, body, tail, operators} = yield* bodyLoop(cursor, prev);

  if (!tail) {
    yield* cursor.log({
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

  yield* cursor.log({
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
    if ((!started) && (started = true)) yield* cursor.log({message: 'beginning ordinal'});

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