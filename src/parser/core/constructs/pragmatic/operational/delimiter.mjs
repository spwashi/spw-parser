import {operational} from "./operational.mjs";

export function delimiter(options) {
  return function* (cursor) { return yield* operational(cursor, null, options); };
}