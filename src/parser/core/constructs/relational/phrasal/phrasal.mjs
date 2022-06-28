import {isPhrasalDelimiter}    from "./checks/cursor/isPhrasalDelimiter.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "./motions/movePastSpaces.mjs";
import {Cursor}                from "../../../cursor.mjs";

export function* phrasal(startingCursor, head) {
  if (!head) {
    yield '[passing phrasal]';
    return false;
  }
  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'phrasal'})

  let {body, tail} = yield* bodyLoop(cursor);

  if (!tail) {
    yield '[not phrasal]';
    return head;
  }
  startingCursor.setOffset(cursor.offset);
  yield '--exiting phrasal--';
  return cursor.token({
                        head: head,
                        body: body.length ? body : undefined,
                        tail: tail
                      });
}

function* bodyLoop(cursor) {
  let body    = [];
  let started = false;
  let tail;
  while (isPhrasalDelimiter(cursor)) {
    if ((!started) && (started = true)) {
      yield '--beginning phrasal--;'
    }

    tail && body.push(tail);

    yield* movePastSpaces(cursor);

    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    if (!token) break;
    yield token;
    tail = token;
  }
  return {body, tail};
}

