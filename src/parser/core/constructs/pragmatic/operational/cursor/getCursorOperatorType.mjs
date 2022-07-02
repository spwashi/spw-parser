import {pragmaticOperators} from "../operators/operators.mjs";

export function getCursorOperatorType(cursor, operators = pragmaticOperators) {
  const char = cursor.curr();
  return operators[char];
}