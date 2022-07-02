import {nominal}   from "../../../../nodes/nominal/nominal.mjs";
import {numeric}   from "../../../../nodes/numeric/numeric.mjs";
import {container} from "../../../../nodes/container/container.mjs";

export function* readLabel(cursor) {
  let label = false;
  if (cursor.curr() === '_') {
    cursor.advance();
    label = yield* cursor.scan([nominal, numeric, container]);
  }
  return label;
}