export function cursorBeginsNumeric(char) {
  if (!char) return false;
  return /\d/.test(char);
}