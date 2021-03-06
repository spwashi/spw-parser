import {Cursor}         from "./core/cursor/cursor.mjs";
import {loopGenerators} from "./core/loop.mjs";


/**
 * Parser for the Spw Language
 *
 *
 * @param input {string} The input string to parse
 * @param asGenerator {boolean?} Whether to loop through the generator or return it.
 */
export function parse(input, asGenerator = false) {
  if (asGenerator) return parser();
  let end;
  for (let v of parser()) {
    end = v;
  }
  return end;

  function* parser() {
    yield* loopGenerators(new Cursor({input}));
  }
}