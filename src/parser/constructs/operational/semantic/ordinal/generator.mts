import {isOrdinalDelimiter}         from "./cursor/checks/isOrdinalDelimiter.mts";
import {ordinalPartOptions}         from "./parts/parts.mts";
import {takeSpaces}                 from "../phrasal/cursor/motions/takeSpaces.mts";
import {_operator}                  from "../../generator.builder.mts";
import {ordinalDelimitingOperators} from "../operators.mts";

export function* ordinal(start, prev) {
  const cursor = start.spawn(prev);
  cursor.token({kind: 'ordinal'});

  yield* cursor.log({message: 'checking ordinal'});

  const {head, body, tail, operators} = yield* loop(cursor, prev);

  if (!operators.length) {
    yield* cursor.log({
                        message: 'not ordinal',
                        miss:    'no operators'
                      })
    return prev ?? false;
  }

  yield* cursor.log({message: 'resolving ordinal'});

  cursor.token({
                 head,
                 body,
                 tail,
                 operators,
               });

  return cursor;
}

const operational = _operator(ordinalDelimitingOperators);

function* loop(cursor, prev) {
  yield* takeSpaces(cursor);
  const head      = prev && prev.token();
  const body      = [];
  const operators = [];
  let group;
  {
    let started = false;
    while (isOrdinalDelimiter(cursor)) {
      if ((!started) && (started = true)) yield* cursor.log({message: 'beginning ordinal'});
      yield* takeSpaces(cursor);

      const operatorScanner = yield* cursor.scan([operational]);
      const operator        = operatorScanner?.token();
      if (!operator) break;
      !group && operators.push(group = []);
      group.push(operator);

      yield* takeSpaces(cursor);
      const bodyScanner = yield* cursor.scan(ordinalPartOptions);
      let token         = bodyScanner ? bodyScanner.token() : null;
      if (!token) {
        token = null;
      } else {
        group = null;
      }
      body.push(token);
      yield* takeSpaces(cursor);
    }
  }

  const tail = body.pop();
  return {head, body, tail, operators,};
}