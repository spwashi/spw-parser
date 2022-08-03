import {beginsLiteral} from "./cursor/beginsLiteral.mjs";
import {takeSpaces}    from "../../operational/semantic/phrasal/cursor/motions/takeSpaces.mjs";
import {_operator}     from "../../operational/generator.builder.mjs";
import {literalPartOptions} from "./parts/parts.mjs";
import {literalDelimitingOperators} from "./parts/operators.mjs";

export function* literal(start, prev) {
  const cursor = start.spawn(prev);

  cursor.token({kind: 'literal'});

  yield* cursor.log({message: 'checking literal'});

  if (prev) {
    yield* cursor.log({
                        message: 'not literal',
                        miss:    'prev'
                      });
    return prev;
  }

  if (!beginsLiteral(start)) {
    yield* cursor.log({
                        message: 'not literal',
                        miss:    'cursor cannot start literal'
                      });
    return false;
  }

  const {head, body, tail} = yield* loop(cursor);

  yield* cursor.log({message: 'resolving literal'});

  cursor.token({head, body, tail});

  return cursor;
}

function* loop(cursor) {
  let open       = literalDelimitingOperators.open;
  const operator = yield* cursor.scan([_operator(open)]);
  const head     = operator?.token();
  const label    = head?.label?.key;
  const close    = literalDelimitingOperators.close._inverse[head.proto.key];

  if (!close) throw new Error('could not resolve type');

  yield* takeSpaces(cursor);

  let started;
  let tail;
  const body = [];

  while (cursor.curr()) {
    if ((!started) && (started = true)) yield* cursor.log({message: 'beginning literal'});
    yield* takeSpaces(cursor);

    const nextCursor = yield* cursor.scan([_operator({[close.key]: close})]);

    const _delimiter = nextCursor?.token();
    const tailLabel  = _delimiter?.label?.key;
    if (_delimiter) {
      if (tailLabel === label || !(tailLabel && label)) {
        tail = _delimiter;
        break;
      }

      body.push(_delimiter);

      yield* takeSpaces(cursor);
    }

    const statement = yield* cursor.scan(literalPartOptions);
    if (!statement) break;

    body.push(statement?.token());

    yield* takeSpaces(cursor);
  }

  return {head, body, tail};
}
