import {isContainerStart}             from "./checks/cursor/isContainerStart.mjs";
import {movePastSpaces}               from "../../relational/phrasal/motions/movePastSpaces.mjs";
import {permittedConstituents}        from "./components/components.mjs";
import {operational}                  from "../../operational/operational.mjs";
import {containerDelimitingOperators} from "../../operational/operators/operators.mjs";
import {Cursor}                       from "../../../cursor.mjs";

export function* containing(startingCursor, activeTok) {
  if (activeTok) {
    yield '[passing containing]';
    return activeTok;
  }
  if (!isContainerStart(startingCursor)) {
    yield '[not containing]';
    return false;
  }

  const cursor = new Cursor(startingCursor)
  cursor.token({kind: 'containing'});

  // head
  const head     = cursor.curr();
  const operator = yield* operational(cursor, null, containerDelimitingOperators);

  // head label

  const label     = operator.label?.key;
  const headToken = operator;

  if (headToken) yield headToken;

  // leading spaces

  yield* movePastSpaces(cursor);

  // tail (expectation)

  let tail, tailToken;
  const endDelimiterChar = containerDelimitingOperators[head]?.opposite;

  // body

  let started;
  const body = [];
  while (cursor.curr()) {
    if ((!started) && (started = true)) yield '--beginning containing--;'
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

  yield '--exiting containing--';
  startingCursor.setOffset(cursor.offset);

  return cursor.token({
                        head: headToken,
                        body: body,
                        tail: tailToken
                      });
}