import {permittedConstituents} from "./components/components.mjs";
import {movePastSpaces}     from "../../semantic/phrasal/motions/movePastSpaces.mjs";
import {pragmaticOperators} from "../../operators/pragmaticOperators.mjs";
import {Cursor}             from "../../../cursor.mjs";
import {buildOperator}      from "../../operators/buildOperator.mjs";

export function* operational(start, prev, domain = pragmaticOperators) {
  const cursor = new Cursor(start, prev);
  cursor.token({kind: 'operational'});

  yield* cursor.log({message: 'checking operational'});

  let {head, body, tail, operators, initialProto,} = yield* bodyLoop(cursor, prev, domain);
  if (!operators.length) {
    yield* cursor.log({
                        message: 'not operational',
                        miss:    'no operators'
                      });
    return false;
  }

  if (!tail && initialProto?.kinds?.has('nominal')) {
    tail = null;
    head = operators.pop();
    cursor.token({kind: 'operational.nominal'})
  }
  cursor.token({operators});

  if (initialProto?.kind === 'delimiter') {
    return cursor;
  }

  if (typeof tail === 'undefined') {
    yield* cursor.log({
                        message: 'not operational',
                        miss:    'missing a tail component',
                        cursor:  cursor,
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

  yield* cursor.log({
                      message: 'resolving operational',
                      cursor:  cursor
                    });

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
  let operator, initialProto;
  while (operator = yield* cursor.scan([buildOperator(permittedOperators)])) {
    if (!operator) continue;
    if (!operator?.token()) break;

    yield* cursor.log({message: 'beginning operational',});
    operators.push(operator.token());

    const proto = operator.token().proto;

    initialProto = initialProto ? initialProto : proto;

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

    operators:    operators,
    initialProto: initialProto
  };
}

