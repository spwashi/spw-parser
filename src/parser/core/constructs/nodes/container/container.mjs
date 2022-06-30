import {isContainerStart}      from "./checks/cursor/isContainerStart.mjs";
import {movePastSpaces}        from "../../semantic/phrasal/motions/movePastSpaces.mjs";
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

  if (headToken) yield headToken;

  let {tailToken, body} = yield* bodyLoop(cursor, head, label);

  _debug && (yield '--exiting container--');
  startingCursor.setOffset(cursor.offset);

  return cursor.token({
                        head: headToken,
                        body: body,
                        tail: tailToken
                      });
}

function* bodyLoop(cursor, head, label) {
  // leading spaces

  yield* movePastSpaces(cursor);

  // tail (expectation)

  let tail, tailToken;
  const endDelimiterChar = containerDelimitingOperators[head]?.opposite;

  // body

  let started;
  const body = [];
  while (cursor.curr()) {
    if ((!started) && (started = true)) _debug && (yield '--beginning container--;');
    yield* movePastSpaces(cursor);

    // tail delimiter check
    if ((cursor.curr() === endDelimiterChar) && (tail = cursor.curr())) {
      const _tailToken = yield* operational(cursor, null, containerDelimitingOperators);
      const tailLabel  = _tailToken.label?.key;

      if ((tailLabel && label) && (tailLabel !== label)) {
        yield _tailToken;
        body.push(_tailToken);
        continue;
      }
      tailToken = _tailToken;
      break;
    }

    // resolve tokens
    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }

    if (!token) break;
    yield token;

    body.push(token);
  }
  return {tailToken, body};
}
