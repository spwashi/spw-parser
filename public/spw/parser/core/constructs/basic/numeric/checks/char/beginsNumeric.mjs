export function beginsNumeric(char) {
  if (!char) return false;
  return /\d/.test(char);
}