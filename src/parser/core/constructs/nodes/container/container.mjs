import {isContainerStart}             from "./checks/cursor/isContainerStart.mjs";
import {movePastSpaces}               from "../../semantic/phrasal/motions/movePastSpaces.mjs";
import {permittedConstituents}        from "./components/components.mjs";
import {operational}                  from "../../pragmatic/operational/operational.mjs";
import {containerDelimitingOperators} from "../../pragmatic/operational/operators/operators.mjs";
import {Cursor}                       from "../../../cursor.mjs";
import {_debug}                       from "../../../constants.mjs";

export function* container(startingCursor, activeTok) {
  if (activeTok) {
    _debug && (yield '[passing container]');
    return activeTok;
  }
  if (!isContainerStart(startingCursor)) {
    _debug && (yield '[not container]');
    return false;
  }

  const cursor = new Cursor(startingCursor)
  cursor.token({kind: 'container'});

  // head
  const head     = cursor.curr();
  const operator = yield* operational(cursor, null, containerDelimitingOperators);

  // head label

  const label     = operator.label?.key;
  const headToken = operator;

  let {tailToken, body} = yield* bodyLoop(cursor, head, label);

  _debug && (yield '--exiting container--');
  startingCursor.setOffset(cursor.offset);

  return cursor.token({
                        key:  [headToken?.key, ...body?.map(node => node?.key) || [], tailToken?.key].join(''),
                        head: headToken,
                        body: body,
                        tail: tailToken
                      });
}

function* bodyLoop(cursor, headChar, label) {
  // leading spaces

  yield* movePastSpaces(cursor);

  // tail (expectation)

  let tailToken;
  const tailChar = containerDelimitingOperators[headChar]?.opposite;

  // body

  let started;
  const body = [];
  while (cursor.curr()) {
    if ((!started) && (started = true)) _debug && (yield '--beginning container--;');
    yield* movePastSpaces(cursor);

    // tail delimiter check
    if ((cursor.curr() === tailChar)) {
      const _tailToken = yield* operational(cursor, null, {[tailChar]: containerDelimitingOperators[tailChar]});
      const tailLabel  = _tailToken.label?.key;

      if ((tailLabel && label) && (tailLabel !== label)) {
        yield _tailToken;
        body.push(_tailToken);
        continue;
      }
      tailToken = _tailToken;
      break;
    }


    yield* movePastSpaces(cursor);
    // resolve tokens
    let token = false, prev;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);

      if (!token && prev) {
        token = prev;
        break;
      }
      prev = token;
    }
    yield* movePastSpaces(cursor);

    if (!token) {
      break;
    }
    yield token;

    body.push(token);
  }
  return {tailToken, body};
}
