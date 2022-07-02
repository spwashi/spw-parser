import {getCursorOperatorType} from "./cursor/getCursorOperatorType.mjs";
import {Cursor}                from "../../../cursor.mjs";
import {readLabel}             from "./cursor/motions/readLabel.mjs";

export function buildOperator(permittedOperators) {
  return function* (start) {
    const proto = getCursorOperatorType(start, permittedOperators);
    if (!proto) {
      yield {
        message: 'not an operator',
        miss:    'no prototype',
        cursors: {start},
        info:    {permittedOperators, curr: start.curr()}
      }
      return false;
    }
    const cursor = new Cursor(start);
    cursor.token({proto: proto});
    cursor.token({kind: 'operator'});
    const operator = [cursor.pos()]
    yield cursor.pos();
    cursor.advance();
    const [_, label] = yield* readLabel(cursor);
    label && operator.push(_, label.token());
    cursor.token({
                   body: operator
                 })
    return cursor;
  }
}