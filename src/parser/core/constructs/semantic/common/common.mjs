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

  let {head, body, operators, tail} = yield* bodyLoop(cursor, activeTok);
  if (!operators.length) {
    return head;
  }

  startingCursor.setOffset(cursor.offset);

  _debug && (yield '--exiting common--');

  body = body.length ? body : undefined;
  return cursor.token({
                        key:       [head?.key, ...body?.map((n) => n?.key) || [], tail?.key].join(' , '),
                        head:      head,
                        body:      body,
                        tail:      tail,
                        operators: operators,
                      });
}

function* bodyLoop(cursor, head) {
  let body      = [];
  let operators = [];
  let started   = false;
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
  const tail = body.pop();
  return {head, body, operators, tail};
}
