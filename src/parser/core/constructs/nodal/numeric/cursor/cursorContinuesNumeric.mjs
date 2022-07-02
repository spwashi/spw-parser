export function cursorContinuesNumeric(char) {
  if (!char) return false;
  return /\d/.test(char);
}