import {getOperatorType}       from "./checks/cursor/getOperatorType.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "../../semantic/phrasal/motions/movePastSpaces.mjs";
import {readLabel}             from "../../../motions/readLabel.mjs";
import {pragmaticOperators}    from "./operators/operators.mjs";
import {Cursor}                from "../../../cursor.mjs";
import {_debug}                from "../../../constants.mjs";

export function* operational(startingCursor, activeTok, permittedOperators = pragmaticOperators) {
  const cursor = new Cursor(startingCursor);
  cursor.token({kind: 'operational',});

  let {
        body,
        tail,
        label,
        operators,
        origOpType,
      } = yield* bodyLoop(cursor, permittedOperators);
  cursor.token({operators: operators});

  if (!operators.length) return false;

  const head = activeTok ? activeTok : undefined;
  body       = body.length ? body : undefined;
  tail       = tail ? tail : undefined;
  cursor.token({key: [head?.key, ...body?.map(n => n?.key) || [], tail?.key].join(operators[0].char),});

  if (label) cursor.token({label: label})
  if (origOpType?.kind === 'delimiter') {
    startingCursor.setOffset(cursor.offset);
    return cursor.token();
  }
  if (!tail) {
    _debug && (yield {
      message: '[not operational]',
      cause:   'no tail',
      info:    {
        head, body, tail,
        tok: cursor.token()
      }
    });
    return activeTok || false;
  }
  startingCursor.setOffset(cursor.offset);

  _debug && (yield '--exiting operational--');


  return cursor.token({
                        key:  [head?.key, ...body?.map(n => n.key) || [], tail?.key].join(operators[0].char),
                        head: head,
                        body: body,
                        tail: tail,
                      })
}

function* bodyLoop(cursor, permittedOperators) {
  let body    = [];
  let tail;
  let started = false;

  if (!permittedOperators[' '])
    yield* movePastSpaces(cursor);
  let opType, origOpType;
  let label;
  const operators = [];
  while ((opType = getOperatorType(cursor, permittedOperators))) {
    if ((!started) && (started = true)) {
      origOpType = opType;
      cursor.token({prototype: origOpType})
      _debug && (yield '--beginning operational--;');
    }

    tail && body.push(tail);
    operators.push(cursor.pos());
    yield cursor.pos();
    cursor.advance();

    label = yield* readLabel(cursor);

    if (opType.kind === 'delimiter') break;

    yield* movePastSpaces(cursor);
    let token = false;
    for (let generator of permittedConstituents) {
      token = yield* generator(cursor, token);
    }
    yield* movePastSpaces(cursor);
    if (!token) break;
    yield token;
    tail = token;
  }


  return {
    operators,
    label,
    body,
    tail: tail,
    origOpType
  };
}

