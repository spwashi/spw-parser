import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}        from "../../semantic/phrasal/motions/movePastSpaces.mjs";
import {pragmaticOperators}    from "./operators/operators.mjs";
import {Cursor}                from "../../../cursor.mjs";
import {_debug}                from "../../../constants.mjs";
import {buildOperator}         from "./buildOperator.mjs";

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

function* bodyLoop(cursor, prev, permittedOperators) {
  const head = prev && prev.token();
  const body = [];

  if (!permittedOperators[' ']) {
    yield* movePastSpaces(cursor);
  }

  const operators = [];
  let operator, origOpType;
  while (operator = yield* cursor.scan([buildOperator(permittedOperators)])) {
    if (!operator) continue;
    if (!operator?.token()) break;

    _debug && (yield '--beginning operational--;');
    operators.push(operator.token());

    const proto = operator.token().proto;

    origOpType = origOpType ? origOpType : proto;
    yield {info: {proto}};

    if (proto.open) {
      const spaces = yield* movePastSpaces(operator);
      spaces.length && body.push(spaces[0]);
    }
    if (!proto.close) {
      yield* movePastSpaces(cursor);
    }

    const _cursor = yield* cursor.scan(permittedConstituents, proto.close ? operator : undefined);
    let token     = _cursor ? _cursor.token() : null;
    if (!token) break
    body.push(token);
    yield* movePastSpaces(cursor);
  }

  const tail = body.pop();
  return {
    head: head,
    body: body,
    tail: tail,

    operators:  operators,
    origOpType: origOpType
  };
}

