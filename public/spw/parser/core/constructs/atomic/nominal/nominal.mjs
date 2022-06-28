import {beginsNominal}    from "./checks/cursor/beginsNominal.mjs";
import {continuesNominal} from "./checks/cursor/continuesNominal.mjs";
import {Cursor}           from "../../../cursor.mjs";

export function* nominal(startingCursor, activeTok) {
  if (activeTok) {
    yield '[passing nominal]';
    return activeTok;
  }

  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'nominal'});

  const key  = [];
  let _check = beginsNominal, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) yield '--beginning nominal--'

    key.push(cursor.curr());
    yield cursor.pos();
    cursor.advance();

    _check = continuesNominal;
  }

  if (!key.length) {
    yield '[not nominal]';
    return false;
  }

  yield '--exiting nominal--';

  startingCursor.setOffset(cursor.offset);

  return cursor.token({key: key.join('')})
}