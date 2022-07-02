export function cursorContinuesNumeric(cursor) {
  const char = cursor.curr();
  if (!char) return false;
  return /\d/.test(char);
}