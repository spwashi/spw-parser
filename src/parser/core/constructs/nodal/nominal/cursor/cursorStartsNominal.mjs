export function cursorStartsNominal(char) {
  if (!char) return false;
  return /[a-zA-Z]/.test(char);
}