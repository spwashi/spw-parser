export function isOrdinalDelimiter(cursor, head) {
  return cursor.curr() === ';' || (head && cursor.curr() === '\n');
}