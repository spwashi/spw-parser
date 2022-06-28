const operators = {
  '*': {name: 'salience', operator: '*'},
  '@': {name: 'perspective', operator: '@'},
}

export function getOperatorKind(cursor) {
  const char = cursor.curr();
  return operators[char];
}