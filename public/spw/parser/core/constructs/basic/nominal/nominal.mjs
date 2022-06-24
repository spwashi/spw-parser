import {beginsNominal}    from "./checks/char/beginsNominal.mjs";
import {continuesNominal} from "./checks/char/continuesNominal.mjs";

export function* nominal(cursor, activeTok) {
  if (activeTok) {
    yield '[passing nominal]';
    return activeTok;
  }

  const tok = [];
  let _check  = beginsNominal, started;
  while (cursor.curr() && _check(cursor.curr())) {
    if ((!started) && (started = true)) yield '--beginning nominal--;'

    tok.push(cursor.curr());
    yield cursor.pos();
    cursor.advance();

    _check = continuesNominal;
  }

  if (!tok.length) return false;

  yield '--exiting nominal--';

  return tok.length ? {type: 'nominal', token: tok.join('')} : false;
}