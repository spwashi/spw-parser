import {beginsNumeric}    from "./checks/cursor/beginsNumeric.mjs";
import {continuesNumeric} from "./checks/cursor/continuesNumeric.mjs";

export function* numeric(cursor, activeTok) {
  if (activeTok) {
    yield '[passing numeric]';
    return activeTok;
  }

  const tok  = [];
  let _check = beginsNumeric, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) yield '--beginning numeric--;'

    tok.push(cursor.curr());
    yield cursor.pos();
    cursor.advance();

    _check = continuesNumeric;
  }

  if (!tok.length) return false;

  yield '--exiting numeric--';

  return {
    kind:     'numeric',
    integral: parseInt(tok.join('')),
  };
}