import {isCommonDelimiter}         from "./cursor/checks/isCommonDelimiter.mts";
import {commonPartOptions}         from "./parts/parts.mts";
import {takeSpaces}                from "../phrasal/cursor/motions/takeSpaces.mts";
import {_operator}                 from "../../generator.builder.mts";
import {commonDelimitingOperators} from "../operators.mts";

export function* common(start, prev) {
  const cursor = start.spawn(prev);
  cursor.token({kind: 'common'});

  yield* cursor.log({message: 'checking common'});

  const {head, body, tail, operators} = yield* bodyLoop(cursor, prev);

  if (!operators.length) {
    yield* cursor.log({
                        message: 'not common',
                        miss:    'no operators'
                      });
    return prev ?? false;
  }

  yield* cursor.log({message: 'resolving common'});

  cursor.token({
                 head:      head,
                 body:      body,
                 tail:      tail,
                 operators: operators,
               });

  return cursor;
}

function* bodyLoop(cursor, prev) {
  yield* takeSpaces(cursor);
  const head      = prev && prev.token();
  const body      = [];
  const operators = [];
  let started     = false;
  while (isCommonDelimiter(cursor)) {
    if ((!started) && (started = true)) yield* cursor.log({message: 'beginning common'});
    yield* takeSpaces(cursor);

    const operatorScanner = yield* cursor.scan([_operator(commonDelimitingOperators)]);
    const operator        = operatorScanner?.token();
    if (!operator) break;
    operators.push(operator);

    yield* takeSpaces(cursor);
    const bodyScanner = yield* cursor.scan(commonPartOptions);
    let token         = bodyScanner ? bodyScanner.token() : null;
    if (!token) { token = null}
    body.push(token);
    yield* takeSpaces(cursor);
  }

  const tail = body.pop();
  return {
    head:      head,
    body:      body,
    tail:      tail,
    operators: operators,
  };
}