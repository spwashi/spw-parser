import {cursorStartsContainer}        from "./cursor/cursorStartsContainer.mjs";
import {movePastSpaces}               from "../../semantic/phrasal/motions/movePastSpaces.mjs";
import {Cursor}                       from "../../../cursor.mjs";
import {_debug}                       from "../../../constants.mjs";
import {containerDelimitingOperators} from "../../pragmatic/operational/operators/operators.mjs";
import {delimiter}                    from "../../pragmatic/operational/delimiter.mjs";
import {permittedConstituents}        from "./components/components.mjs";

export function* container(start, prev) {
  if (prev) {
    _debug && (yield '[passing container: prev]');
    return prev;
  }
  const cursor = new Cursor(start)
  cursor.token({kind: 'container'});

  if (!cursorStartsContainer(start)) {
    _debug && (yield '[not container]');
    return false;
  }

  const {head, body, tail} = yield* bodyLoop(cursor);

  cursor.token({
                 head: head,
                 body: body,
                 tail: tail
               });

  return cursor;
}

function* bodyLoop(cursor) {
  const operator = yield* cursor.scan([delimiter(containerDelimitingOperators)]);
  const head     = operator?.token();
  const label    = head?.label?.key;
  yield {cursor}

  yield* movePastSpaces(cursor);
  const tailChar = head?.proto?.opposite;

  let started;
  let tail;
  const body = [];
  while (cursor.curr()) {
    if ((!started) && (started = true)) _debug && (yield '--beginning container--;');
    yield* movePastSpaces(cursor);

    const delimiterScanner = yield* cursor.scan([delimiter({[tailChar]: containerDelimitingOperators[tailChar]})]);

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
