import {cursorStartsNominal}    from "./cursor/cursorStartsNominal.mjs";
import {cursorContinuesNominal} from "./cursor/cursorContinuesNominal.mjs";
import {Cursor}                 from "../../../cursor.mjs";
import {_debug}                 from "../../../constants.mjs";

export function* nominal(start, prev) {
  const cursor = new Cursor(start);
  cursor.token({kind: 'nominal'});

  if (prev) {
    _debug && (yield '[passing nominal]');
    return prev;
  }

  const key = yield* bodyLoop(cursor);

  if (!key.length) {
    _debug && (yield '[not nominal]');
    return false;
  }

  _debug && (yield '--exiting nominal--');

  const head = {key: key.join('')};
  cursor.token({key: head.key, head: head});

  return cursor;
}

function* bodyLoop(cursor) {
  const key  = [];
  let _check = cursorStartsNominal, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) _debug && (yield '--beginning nominal--');
    key.push(cursor.curr());

    yield cursor.pos();

    cursor.advance();

    _check = cursorContinuesNominal;
  }
  return key;
}
