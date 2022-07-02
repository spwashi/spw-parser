import {getCursorOperatorType} from "./cursor/getCursorOperatorType.mjs";
import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "../../semantic/phrasal/motions/movePastSpaces.mjs";
import {readLabel}             from "./cursor/motions/readLabel.mjs";
import {pragmaticOperators}    from "./operators/operators.mjs";
import {Cursor}                from "../../../cursor.mjs";
import {_debug}                from "../../../constants.mjs";

export function* operational(start, prev, domain = pragmaticOperators) {
  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'operational'});

  const {head, body, tail, label, operators, origOpType,} = yield* bodyLoop(cursor, prev, domain);
  if (!operators.length) return false;

  if (label) cursor.token({label: label})
  cursor.token({operators: operators});
  cursor.token({
                 key: [head?.key, ...body?.map(n => n?.key) || [], tail?.key].join(operators[0].char),
               });

  if (origOpType?.kind === 'delimiter') {
    return cursor;
  }

  if (!tail) {
    _debug && (yield {
      message: '[not operational]',
      cause:   'no tail',
      info:    {
        head: head,
        body,
        tail,
        tok:  cursor.token(),
      }
    });

    cursor.token(false);

    return false;
  }

  _debug && (yield '--exiting operational--');

  cursor.token({
                 key:  [head?.key, ...body?.map(n => n.key) || [], tail?.key].join(operators[0].char),
                 head: head,
                 body: body,
                 tail: tail,
               });

  return cursor;
}

function* bodyLoop(cursor, prev, permittedOperators) {
  const head  = prev && prev.token();
  let body    = [];
  let started = false;

  if (!permittedOperators[' ']) {
    yield* movePastSpaces(cursor);
  }

  let opType, origOpType;
  let label;
  const operators = [];
  while ((opType = getCursorOperatorType(cursor, permittedOperators))) {
    if ((!started) && (started = true)) {
      origOpType = opType;
      cursor.token({proto: origOpType});
      _debug && (yield '--beginning operational--;');
    }

    operators.push(cursor.pos());
    yield cursor.pos();
    cursor.advance();

    label = yield* readLabel(cursor);

    if (opType.kind === 'delimiter') break;

    yield* movePastSpaces(cursor);
    const _cursor = yield* cursor.scan(permittedConstituents);
    let token     = _cursor ? _cursor.token() : null;
    if (!token) break
    body.push(token);
    yield* movePastSpaces(cursor);
  }

  const tail = body.pop();
  return {
    head:       head,
    body:       body,
    tail:       tail,
    label:      label,
    operators:  operators,
    origOpType: origOpType
  };
}

