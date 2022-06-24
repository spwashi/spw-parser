export function continuesNumeric(char) {
  if (!char) return false;
  return /\d/.test(char);
}