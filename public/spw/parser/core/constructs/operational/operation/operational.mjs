import {getOperatorKind}       from "./checks/cursor/getOperatorKind.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "../../relational/phrasal/motions/movePastSpaces.mjs";

export function* operational(cursor, activeTok) {
  let body        = [];
  let prev;
  let started     = false;
  let startOffset = cursor.pos().offset;
  yield* movePastSpaces(cursor);
  let kind, origKind;
  while ((kind = getOperatorKind(cursor))) {
    if ((!started) && (started = true)) {
      origKind = kind;
      yield '--beginning operational--;'
    }

    prev && body.push(prev);

    cursor.advance();
    yield* movePastSpaces(cursor);
    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    yield* movePastSpaces(cursor);
    if (!token) break;
    yield token;
    prev = token;
  }

  if (!prev) {
    cursor.reset(startOffset);
    yield '[not operational]';
    return activeTok;
  }
  yield '--exiting operational--';
  return {
    kind:    'operational',
    subkind: origKind,

    head: activeTok ? activeTok : undefined,
    body: body.length ? body : undefined,
    tail: prev
  };
}

