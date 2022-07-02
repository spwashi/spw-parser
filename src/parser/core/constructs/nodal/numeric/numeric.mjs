import {cursorBeginsNumeric}    from "./cursor/cursorBeginsNumeric.mjs";
import {cursorContinuesNumeric} from "./cursor/cursorContinuesNumeric.mjs";
import {Cursor}                 from "../../../cursor.mjs";
import {_debug}                 from "../../../constants.mjs";

export function* numeric(start, prev) {
  const cursor = new Cursor(start);
  cursor.token({kind: 'numeric'});

  if (prev) {
    _debug && (yield '[passing numeric]');
    return prev;
  }

  let {integral: _integral, fractional: _fractional} = yield* bodyLoop(cursor);

  if (!(_integral.length || _fractional.length)) {
    _debug && (yield '[not numeric]');
    return false;
  }

  _debug && (yield '--exiting numeric--');

  const integral   = _integral.length ? parseInt(_integral.join('')) : _integral;
  const fractional = _fractional.length ? parseFloat(`.${_fractional.join()}`) : undefined;
  const head       = {key: integral + fractional};
  cursor.token({
                 head:       head,
                 integral:   integral,
                 fractional: fractional,
               });

  return cursor;
}

function* bodyLoop(cursor) {
  const integral = [];
  let _check     = cursorBeginsNumeric, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) {
      _check = cursorContinuesNumeric;
      _debug && (yield '--beginning numeric--;');
    }

    integral.push(cursor.curr());
    yield cursor.pos();
    cursor.advance();
  }

  let fractional = [];
  if (cursor.curr() === '.') {
    cursor.advance()
    let started = false, _check = cursorContinuesNumeric;
    while (cursor.curr() && _check(cursor.curr())) {
      if (!started && (started = true)) {
        _check = cursorContinuesNumeric;
        _debug && (yield '--continuing numeric: fractional--;');
      }
      fractional.push(cursor.curr());
      yield cursor.pos();
      cursor.advance();
    }
  }
  return {
    integral,
    fractional
  };
}
