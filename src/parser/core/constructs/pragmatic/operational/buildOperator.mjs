import {getCursorOperatorType} from "./cursor/getCursorOperatorType.mjs";
import {Cursor}                from "../../../cursor.mjs";
import {readLabel}             from "./cursor/motions/readLabel.mjs";

export function buildOperator(permittedOperators) {
  return function* (start) {
    const cursor = new Cursor(start);
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