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

  let {integral: _integral, fractional: _fractional} = yield* bodyLoop(cursor);

  if (!(_integral.length || _fractional.length)) {
    _debug && (yield '[not numeric]');
    return false;
  }

  _debug && (yield '--exiting numeric--');

  startingCursor.setOffset(cursor.offset);

  const integral   = _integral.length ? parseInt(_integral.join('')) : _integral;
  const fractional = _fractional.length ? parseFloat(`.${_fractional.join()}`) : undefined;
  const head       = {key: integral + fractional};
  return cursor.token({
                        key:        head.key,
                        head:       head,
                        integral:   integral,
                        fractional: fractional,
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
