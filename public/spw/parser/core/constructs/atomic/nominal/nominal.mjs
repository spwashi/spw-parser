import {beginsNominal}    from "./checks/cursor/beginsNominal.mjs";
import {continuesNominal} from "./checks/cursor/continuesNominal.mjs";

export function* nominal(cursor, activeTok) {
  if (activeTok) {
    yield '[passing nominal]';
    return activeTok;
  }

  const tok  = [];
  let _check = beginsNominal, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) yield '--beginning nominal--;'

    tok.push(cursor.curr());
    yield cursor.pos();
    cursor.advance();

    _check = continuesNominal;
  }

  if (!tok.length) {
    yield '[not nominal]';
    return false;
  }

  yield '--exiting nominal--';

  return {
    kind: 'nominal',
    key:  tok.join(''),
  };
}