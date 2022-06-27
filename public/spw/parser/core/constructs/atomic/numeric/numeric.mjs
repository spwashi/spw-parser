import {beginsNumeric}    from "./checks/cursor/beginsNumeric.mjs";
import {continuesNumeric} from "./checks/cursor/continuesNumeric.mjs";

export function* numeric(cursor, activeTok) {
  if (activeTok) {
    yield '[passing numeric]';
    return activeTok;
  }

  const integral = [];
  let _check     = beginsNumeric, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) {
      _check = continuesNumeric;
      yield '--beginning numeric--;'
    }

    integral.push(cursor.curr());
    yield cursor.pos();
    cursor.advance();
  }

  let fractional = [];
  if (cursor.curr() === '.') {
    cursor.advance()
    let started = false, _check = continuesNumeric;
    while (cursor.curr() && _check(cursor.curr())) {
      if (!started && (started = true)) {
        _check = continuesNumeric;
        yield '--continuing numeric: fractional--;'
      }
      fractional.push(cursor.curr());
      yield cursor.pos();
      cursor.advance();
    }
  }

  if (!integral.length) return false;

  yield '--exiting numeric--';

  return {
    kind:       'numeric',
    integral:   parseInt(integral.join('')),
    fractional: fractional.length ? parseFloat(`.${fractional.join()}`) : undefined
  };
}