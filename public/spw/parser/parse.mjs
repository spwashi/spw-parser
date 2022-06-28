import {Cursor}         from "./core/cursor.mjs";
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
  const out = [];
  for (let v of parser()) {
    out.push(v);
  }
  return out[out.length - 1];

  function* parser() {
    yield* loopGenerators(new Cursor({input}));
  }
}

if (typeof window !== "undefined") window.parse = parse;