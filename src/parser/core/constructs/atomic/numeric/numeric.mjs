import {beginsNumeric}    from "./checks/cursor/beginsNumeric.mjs";
import {continuesNumeric} from "./checks/cursor/continuesNumeric.mjs";
import {Cursor}           from "../../../cursor.mjs";
import {_debug}           from "../../../constants.mjs";

export function* numeric(startingCursor, activeTok) {
  if (activeTok) {
    _debug && (yield '[passing numeric]');
    return activeTok;
  }

  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'numeric'});

  let {integral, fractional} = yield* bodyLoop(cursor);

  if (!(integral.length || fractional.length)) {
    _debug && (yield '[not numeric]');
    return false;
  }

  _debug && (yield '--exiting numeric--');

  startingCursor.setOffset(cursor.offset);

  return cursor.token({
                        integral:   integral.length ? parseInt(integral.join('')) : integral,
                        fractional: fractional.length ? parseFloat(`.${fractional.join()}`) : undefined
                      });
}

function* bodyLoop(cursor) {
  const integral = [];
  let _check     = beginsNumeric, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) {
      _check = continuesNumeric;
      _debug && (yield '--beginning numeric--;');
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
        _debug && (yield '--continuing numeric: fractional--;');
      }
      fractional.push(cursor.curr());
      yield cursor.pos();
      cursor.advance();
    }
  }
  return {integral, fractional};
}
