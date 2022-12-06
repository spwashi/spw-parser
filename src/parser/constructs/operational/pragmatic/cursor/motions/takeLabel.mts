import {nominal}   from "../../../../nodal/nominal/generator.mts";
import {numeric}   from "../../../../nodal/numeric/generator.mts";
import {container} from "../../../../nodal/container/generator.mts";

export function* takeLabel(cursor) {
  let labelCursor = false;
  let char;
  if (cursor.curr() === '_') {
    char  = yield* cursor.take();
    labelCursor = yield* cursor.scan([nominal, numeric, container]);
  }
  return [char, labelCursor];
}