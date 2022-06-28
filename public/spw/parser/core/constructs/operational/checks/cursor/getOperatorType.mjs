import {pragmaticOperators} from "../../operators/operators.mjs";

export function getOperatorType(cursor, operators = pragmaticOperators) {
  const char = cursor.curr();
  return operators[char];
}