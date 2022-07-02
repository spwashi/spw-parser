import {cursorBeginsNumeric}    from "./cursor/cursorBeginsNumeric.mjs";
import {cursorContinuesNumeric} from "./cursor/cursorContinuesNumeric.mjs";
import {Cursor}                 from "../../../cursor.mjs";
import {_debug}                 from "../../../constants.mjs";

export function* numeric(start, prev) {
  const cursor = new Cursor(start);
  cursor.token({kind: 'numeric'});

  if (prev) {
    _debug && (yield {
      message: '[passing numeric: following prev]'
    });
    return prev;
  }

  let {integral: _integral, fractional: _fractional} = yield* bodyLoop(cursor);

  if (!(_integral.length || _fractional.length)) {
    _debug && (yield {
      message: '[not numeric: no integral or fractional components]'
    });
    return false;
  }

  _debug && (yield {
    message: '--resolving numeric--'
  });

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
  while (_check(cursor)) {
    if ((!started) && (started = true)) {
      _check = cursorContinuesNumeric;
      _debug && (yield {
        message: '--beginning numeric--;'
      });
    }

    integral.push(cursor.curr());
    yield cursor.pos();
    cursor.advance();
  }

  let fractional = [];
  if (cursor.curr() === '.') {
    cursor.advance()
    let started = false, _check = cursorContinuesNumeric;
    while (_check(cursor)) {
      if (!started && (started = true)) {
        _check = cursorContinuesNumeric;
        _debug && (yield {
          message: '--continuing numeric: fractional--;'
        });
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
