import {nominal}    from "../constructs/atomic/nominal/nominal.mjs";
import {numeric}    from "../constructs/atomic/numeric/numeric.mjs";
import {containing} from "../constructs/atomic/container/containing.mjs";

export function* readLabel(cursor) {
  let label = false;
  if (cursor.curr() === '_') {
    cursor.advance();
    for (let generator of [nominal, numeric, containing]) {
      label = yield* generator(cursor, label);
    }
  }
  return label;
}