const operators = {
  '*': {name: 'salience'}
}

export function isOperator(cursor) {
  return operators[cursor.curr()];
}