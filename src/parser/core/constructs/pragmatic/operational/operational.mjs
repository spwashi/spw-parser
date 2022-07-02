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

  const {head, body, tail, operators, origOpType,} = yield* bodyLoop(cursor, prev, domain);
  if (!operators.length) return false;

  cursor.token({operators})
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
                 head: head,
                 body: body,
                 tail: tail,
               });

  return cursor;
}

function* buildOperator(start) {
  const cursor = new Cursor(start);
  cursor.token({kind: 'operator'});
  const operator = [cursor.pos()]
  yield cursor.pos();
  cursor.advance();
  const [_, label] = yield* readLabel(cursor);
  label && operator.push(_, label.token());
  const spaces = yield* movePastSpaces(cursor);
  spaces.length && operator.push(spaces[0]);
  cursor.token({
                 body: operator
               })
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
  const operators = [];
  while ((opType = getCursorOperatorType(cursor, permittedOperators))) {
    if ((!started) && (started = true)) {
      origOpType = opType;
      cursor.token({proto: origOpType});
      _debug && (yield '--beginning operational--;');
    }


    const operator = yield* cursor.scan([buildOperator]);
    if (!operator?.token()) {
      break;
    }
    operators.push(operator.token());
    if (opType.kind === 'delimiter') break;

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
    operators:  operators,
    origOpType: origOpType
  };
}

