export function beginsNominal(char) {
  if (!char) return false;
  return /\p{L}/u.test(char) || ['↘', '↗', '↙', '↖', '↔', '↕', '→', '←', '↑', '↓', '%', '␠'].includes(char);
}