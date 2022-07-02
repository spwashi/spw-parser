import {cursorStartsNominal}    from "./cursor/cursorStartsNominal.mjs";
import {cursorContinuesNominal} from "./cursor/cursorContinuesNominal.mjs";
import {Cursor}                 from "../../../cursor.mjs";
import {trailingContainers}     from "./components/trailingContainers.mjs";

export function* nominal(start, prev) {
  const cursor = new Cursor(start);
  cursor.token({kind: 'nominal'});

  yield* cursor.log({message: 'checking nominal'});

  if (prev) {
    yield* cursor.log({
                        message: 'not nominal',
                        miss:    'cannot follow prev'
                      });
    return prev;
  }

  const key = yield* bodyLoop(cursor);

  if (!key.length) {
    yield* cursor.log({
                        message: 'not nominal',
                        miss:    'no key',
                      });
    return false;
  }

  yield* cursor.log({message: 'resolving nominal'});

  const head = {key: key.join('')};
  cursor.token({head: head});

  const containers = yield* trailingContainers(cursor);
  if (containers.size) {
    cursor.token({description: containers});
  }
  return cursor;
}

function* bodyLoop(cursor) {
  const key  = [];
  let _check = cursorStartsNominal, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) yield* cursor.log({message: 'beginning nominal'});
    key.push(cursor.curr());

    yield* cursor.take();

    _check = cursorContinuesNominal;
  }
  return key;
}
