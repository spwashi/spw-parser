import {nominal}   from "../../../../nodal/nominal/nominal.mjs";
import {numeric}   from "../../../../nodal/numeric/numeric.mjs";
import {container} from "../../../../nodal/container/container.mjs";

export function* readLabel(cursor) {
  let label = false;
  let char;
  if (cursor.curr() === '_') {
    char = cursor.pos();
    yield char;
    cursor.advance();
    label = yield* cursor.scan([nominal, numeric, container]);
  }
  return [char, label];
}