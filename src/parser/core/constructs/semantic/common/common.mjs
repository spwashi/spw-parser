import {isCommonDelimiter}         from "./checks/cursor/isCommonDelimiter.mjs";
import {permittedConstituents}     from "./components/components.mjs";
import {movePastSpaces}            from "../phrasal/motions/movePastSpaces.mjs";
import {Cursor}                    from "../../../cursor.mjs";
import {operational}               from "../../pragmatic/operational/operational.mjs";
import {commonDelimitingOperators} from "../../pragmatic/operational/operators/operators.mjs";
import {_debug}                    from "../../../constants.mjs";

export function* common(startingCursor, activeTok) {
  if (!activeTok) {
    _debug && (yield '[passing common]');
    return false;
  }

  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'common'});

  let {body, operators, curr} = yield* bodyLoop(cursor, activeTok);

  if (body.length === 1) {
    return curr !== cursor.pos().offset ? false : activeTok;
  }

  startingCursor.setOffset(cursor.offset);

  _debug && (yield '--exiting common--');

  return cursor.token({
                        operators: operators,
                        body:      body.length ? body : undefined,
                      });
}

function* bodyLoop(cursor, activeTok) {
  let body      = [activeTok];
  let operators = [];
  let started   = false;
  let curr      = cursor.pos().offset;
  while (isCommonDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      _debug && (yield '--beginning common--;');
    }

    const operator = yield* operational(cursor, null, commonDelimitingOperators);
    operators.push(operator);
    yield* movePastSpaces(cursor);

    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    if (!token) break;
    yield token;

    body.push(token);
  }
  return {body, operators, curr};
}
