import {Cursor}               from "./core/cursor.mjs";
import {loopGenerators}             from "./core/loop.mjs";
import {ERROR_INPUT_MUST_BE_STRING} from "./tests/test.mjs";


function assertInputIsString(input) {
  if (typeof input !== 'string' || !input.length) {
    throw new Error(ERROR_INPUT_MUST_BE_STRING)
  }
}

/**
 * Parser for the Spw Language
 *
 *
 * @param input {string} The input string to parse
 * @param asGenerator {boolean?} Whether to loop through the generator or return it.
 */
export function parse(input, asGenerator = false) {
  assertInputIsString(input);
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

