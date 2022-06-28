import {isContainerStart}         from "./checks/cursor/isContainerStart.mjs";
import {getContainerEndDelimiter} from "./util/containerDelimiterMap.mjs";
import {movePastSpaces}           from "../../relational/phrasal/motions/movePastSpaces.mjs";
import {permittedConstituents}    from "./components/components.mjs";
import {nominal}                  from "../nominal/nominal.mjs";
import {numeric}                  from "../numeric/numeric.mjs";

function* readLabel(cursor) {
  let label = false;
  if (cursor.curr() === '_') {
    cursor.advance();
    for (let generator of [nominal, numeric, containing]) {
      label = yield* generator(cursor, label);
    }
  }
  return label;
}

export function* containing(cursor, activeTok) {
  if (activeTok) {
    yield '[passing containing]';
    return activeTok;
  }
  if (!isContainerStart(cursor)) {
    yield '[not containing]';
    return false;
  }

  // head

  const head = cursor.curr();
  cursor.advance();

  // head label

  const label     = yield* readLabel(cursor);
  const headToken = {
    kind:      'container-head',
    delimiter: head,
    label:     label ? label : undefined,
  };

  if (headToken) yield headToken;

  // leading spaces

  yield* movePastSpaces(cursor);

  // tail (expectation)

  let tail, tailToken;
  const endDelimiterChar = getContainerEndDelimiter(head);

  // body

  let started;
  const body = [];
  while (cursor.curr()) {
    if ((!started) && (started = true)) yield '--beginning containing--;'
    yield* movePastSpaces(cursor);

    // tail delimiter check
    if ((cursor.curr() === endDelimiterChar) && (tail = cursor.curr())) {
      cursor.advance()
      const tailLabel  = yield* readLabel(cursor);
      const _tailToken = {
        kind:      'container-tail',
        delimiter: tail,
        label:     tailLabel ? tailLabel : undefined
      };

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

  return {
    kind: 'containing',
    head: headToken,
    body: body,
    tail: tailToken,
  };
}