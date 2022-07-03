import {pragmaticOperators} from "../../../operators/pragmaticOperators.mjs";

export function getCursorOperatorType(cursor, operators = pragmaticOperators) {
  const char = cursor.curr();
  return operators[char];
}