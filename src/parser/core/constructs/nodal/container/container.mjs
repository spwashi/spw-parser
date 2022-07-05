import {cursorStartsContainer}        from "./cursor/cursorStartsContainer.mjs";
import {movePastSpaces}               from "../../semantic/phrasal/motions/movePastSpaces.mjs";
import {buildOperator}                from "../../operators/buildOperator.mjs";
import {permittedConstituents}        from "./components/components.mjs";
import {containerDelimitingOperators} from "../../operators/semanticOperators.mjs";

export function* container(start, prev) {
  const cursor = start.spawn(prev);
  cursor.token({kind: 'container'});

  yield* cursor.log({message: 'checking container'});

  if (prev) {
    yield* cursor.log({
                        message: 'not container',
                        miss:    'prev'
                      });
    return prev;
  }

  if (!cursorStartsContainer(start)) {
    yield* cursor.log({
                        message: 'not container',
                        miss:    'cursor cannot start container'
                      });
    return false;
  }

  const {head, body, tail} = yield* bodyLoop(cursor);

  yield* cursor.log({message: 'resolving container'});
  cursor.token({
                 head: head,
                 body: body,
                 tail: tail
               });

  return cursor;
}

function* bodyLoop(cursor) {
  let open       = containerDelimitingOperators.open;
  const operator = yield* cursor.scan([buildOperator(open)]);
  const head     = operator?.token();
  const label    = head?.label?.key;
  const close    = containerDelimitingOperators.close._inverse[head.proto.key];

  if (!close) throw new Error('could not resolve type');

  yield* movePastSpaces(cursor);

  let started;
  let tail;
  const body = [];
  while (cursor.curr()) {
    if ((!started) && (started = true)) yield* cursor.log({message: 'beginning container'});
    yield* movePastSpaces(cursor);

    const delimiterScanner = yield* cursor.scan([buildOperator({[close.key]: close})]);

    const _delimiter = delimiterScanner?.token();
    const tailLabel  = _delimiter?.label?.key;
    if (_delimiter) {
      if (tailLabel === label || !(tailLabel && label)) {
        tail = _delimiter;
        break;
      }
      body.push(_delimiter)
      yield* movePastSpaces(cursor);
    }

    const statement = yield* cursor.scan(permittedConstituents);
    if (!statement) break;
    body.push(statement?.token());
    yield* movePastSpaces(cursor);
  }
  return {
    head: head,
    body: body,
    tail: tail,
  };
}
