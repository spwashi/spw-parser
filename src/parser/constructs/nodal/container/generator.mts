import {beginsContainer} from './cursor/beginsContainer.mjs';
import {takeSpaces} from '../../operational/semantic/phrasal/cursor/motions/takeSpaces.mjs';
import {_operator} from '../../operational/generator.builder.mjs';
import {containerPartOptions} from './parts/parts.mjs';
import {containerDelimitingOperators} from './parts/operators.mjs';

export function* container(start, prev) {
  const cursor = start.spawn(prev);

  cursor.token({kind: 'container'});

  yield* cursor.log({message: 'checking container'});

  if (prev) {
    yield* cursor.log({
                        message: 'not container',
                        miss:    'prev',
                      });
    return prev;
  }

  if (!beginsContainer(start)) {
    yield* cursor.log({
                        message: 'not container',
                        miss:    'cursor cannot start container',
                      });
    return false;
  }

  const {head, body, tail} = yield* loop(cursor);

  cursor.token({kind: head.proto.name.split('.')[0]})

  yield* cursor.log({message: 'resolving container'});

  cursor.token({head, body, tail});

  return cursor;
}

function* loop(cursor) {
  const open     = containerDelimitingOperators.open;
  const operator = yield* cursor.scan([_operator(open)]);
  const head     = operator?.getToken();
  const label    = head?.label?.key;
  const close    = containerDelimitingOperators.close._inverse[head.proto.key];

  if (!close) throw new Error('could not resolve type');

  yield* takeSpaces(cursor);

  let started;
  let tail;
  const body: any[] = [];

  while (cursor.curr()) {
    if ((!started) && (started = true)) yield* cursor.log({message: 'beginning container'});
    yield* takeSpaces(cursor);

    const delimiterScanner = yield* cursor.scan([_operator({[close.key]: close})]);

    const _delimiter = delimiterScanner?.getToken();
    const tailLabel  = _delimiter?.label?.key;
    if (_delimiter) {
      if (tailLabel === label || !(tailLabel && label)) {
        tail = _delimiter;
        break;
      }

      body.push(_delimiter);

      yield* takeSpaces(cursor);
    }

    const statement = yield* cursor.scan(containerPartOptions);
    if (!statement) break;

    body.push(statement?.getToken());

    yield* takeSpaces(cursor);
  }

  return {head, body, tail};
}
