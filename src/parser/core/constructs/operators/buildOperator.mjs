import {getCursorOperatorType} from "../pragmatic/operational/cursor/getCursorOperatorType.mjs";
import {readLabel}             from "../pragmatic/operational/cursor/motions/readLabel.mjs";

export function buildOperator(permittedOperators) {
  return function* (start) {
    const cursor = start.spawn();
    cursor.token({kind: 'operator'});

    yield* cursor.log({message: 'checking operator'});

    const proto = getCursorOperatorType(start, permittedOperators);
    if (!proto) {
      yield* cursor.log({
                          message: 'not an operator',
                          miss:    'no prototype',
                          cursors: {start},
                          info:    {permittedOperators, curr: start.curr()}
                        });
      return false;
    }
    cursor.token({proto: proto});
    const operator = [cursor.pos()]
    yield* cursor.take();
    const [_, label] = yield* readLabel(cursor);
    label && operator.push(_, label.token());
    cursor.token({
                   body: operator
                 })
    return cursor;
  }
}