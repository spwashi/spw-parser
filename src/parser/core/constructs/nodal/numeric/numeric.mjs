import {cursorBeginsNumeric}    from "./cursor/cursorBeginsNumeric.mjs";
import {cursorContinuesNumeric} from "./cursor/cursorContinuesNumeric.mjs";
import {Cursor}                 from "../../../cursor.mjs";

export function* numeric(start, prev) {
  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'numeric'});

  if (prev) {
    yield* cursor.log({
                        message: 'not numeric',
                        miss:    'cannot follow prev',
                        cursors: {start, prev}
                      });
    return prev;
  }

  let {integral: _integral, fractional: _fractional} = yield* bodyLoop(cursor);

  if (!(_integral.length || _fractional.length)) {
    yield* cursor.log({
                        message: 'not numeric',
                        miss:    'no integral or fractional components',
                      });
    return false;
  }

  yield* cursor.log({message: 'resolving numeric'});

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
      yield* cursor.log({
                          message: 'beginning numeric',
                          info:    {component: 'integral'}
                        });
    }

    integral.push(cursor.curr());
    yield* cursor.take();
  }

  let fractional = [];
  if (cursor.curr() === '.') {
    yield* cursor.take()
    let started = false, _check = cursorContinuesNumeric;
    while (_check(cursor)) {
      if (!started && (started = true)) {
        _check = cursorContinuesNumeric;
        yield* cursor.log({
                            message: 'continuing numeric',
                            info:    {component: 'fractional'}
                          });
      }
      fractional.push(cursor.curr());
      yield* cursor.take();
    }
  }
  return {
    integral,
    fractional
  };
}
