import {beginsNominal}    from "./checks/cursor/beginsNominal.mjs";
import {continuesNominal} from "./checks/cursor/continuesNominal.mjs";
import {Cursor}           from "../../../cursor.mjs";
import {_debug}           from "../../../constants.mjs";

export function* nominal(startingCursor, activeTok) {
  if (activeTok) {
    _debug && (yield '[passing nominal]');
    return activeTok;
  }

  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'nominal'});

  const key = yield* bodyLoop(cursor);

  if (!key.length) {
    _debug && (yield '[not nominal]');
    return false;
  }

  _debug && (yield '--exiting nominal--');

  startingCursor.setOffset(cursor.offset);

  const head = {key: key.join('')};
  return cursor.token({
                        key:  head.key,
                        head: head
                      })
}

function* bodyLoop(cursor) {
  const key  = [];
  let _check = beginsNominal, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) _debug && (yield '--beginning nominal--');

    key.push(cursor.curr());
    yield cursor.pos();
    cursor.advance();

    _check = continuesNominal;
  }
  return key;
}
