import {isPhrasalDelimiter}         from "./checks/cursor/isPhrasalDelimiter.mjs";
import {permittedConstituents}      from "./components/components.mjs";
import {movePastSpaces}             from "./motions/movePastSpaces.mjs";
import {Cursor}                     from "../../../cursor.mjs";
import {_debug}                     from "../../../constants.mjs";
import {operational}                from "../../pragmatic/operational/operational.mjs";
import {phrasalDelimitingOperators} from "../../pragmatic/operational/operators/operators.mjs";

export function* phrasal(startingCursor, head) {
  if (!head) {
    _debug && (yield '[passing phrasal]');
    return false;
  }
  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'phrasal'})

  let {body, tail, operators} = yield* bodyLoop(cursor);

  if (!tail) {
    _debug && (yield '[not phrasal]');
    return head;
  }
  startingCursor.setOffset(cursor.offset);
  _debug && (yield '--exiting phrasal--');
  return cursor.token({
                        key:  [head?.key, body?.map(n => n?.key), tail?.key].join(' '),
                        head: head,
                        body: body.length ? body : undefined,
                        tail: tail,
                        operators
                      });
}

function* bodyLoop(cursor) {
  let body      = [];
  let started   = false;
  let tail;
  let spaces    = [];
  let operators = [];
  while (isPhrasalDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      _debug && (yield '--beginning phrasal--;');
    }

    tail && body.push(tail);

    const operator = yield* operational(cursor, null, phrasalDelimitingOperators);
    operators.push(operator);
    for (let space of movePastSpaces(cursor)) {
      spaces.push(space);
    }

    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    if (!token) break;
    yield token;
    tail = token;
  }
  return {body, tail, operators: operators};
}

