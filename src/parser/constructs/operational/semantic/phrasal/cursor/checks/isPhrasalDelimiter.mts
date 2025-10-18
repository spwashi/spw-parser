export function isPhrasalDelimiter(cursor) {
  const char = cursor.curr();
  if (!char) return false;
  return /\s/.test(char);
}