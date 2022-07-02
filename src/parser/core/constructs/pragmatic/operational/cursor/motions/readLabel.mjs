import {nominal}   from "../../../../nodal/nominal/nominal.mjs";
import {numeric}   from "../../../../nodal/numeric/numeric.mjs";
import {container} from "../../../../nodal/container/container.mjs";

export function* readLabel(cursor) {
  let label = false;
  let char;
  if (cursor.curr() === '_') {
    char  = yield* cursor.take();
    label = yield* cursor.scan([nominal, numeric, container]);
  }
  return [char, label];
}