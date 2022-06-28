import {beginsNumeric}    from "./checks/cursor/beginsNumeric.mjs";
import {continuesNumeric} from "./checks/cursor/continuesNumeric.mjs";
import {Cursor}           from "../../../cursor.mjs";

export function* numeric(startingCursor, activeTok) {
  if (activeTok) {
    yield '[passing numeric]';
    return activeTok;
  }

  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'numeric'});

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

  if (!(integral.length || fractional.length)) {
    yield '[not numeric]';
    return false;
  }

  yield '--exiting numeric--';

  startingCursor.setOffset(cursor.offset);

  return cursor.token({
                        integral:   integral.length ? parseInt(integral.join('')) : integral,
                        fractional: fractional.length ? parseFloat(`.${fractional.join()}`) : undefined
                      });
}