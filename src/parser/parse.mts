import {Scanner}         from "../core/lens/scanner.mts";
import {allConstructs}   from "./constructs/constructs.mts";
import {Lens}            from "../core/lens/lens.mts";
import {CharacterCursor} from "../core/cursor/cursor.mts";


class ParserLens extends Lens {
  generators = Object.values(allConstructs);
  Cursor     = CharacterCursor;
}

/**
 * Parser for the Spw Language
 *
 *
 * @param input {string} The input string to parse
 * @param config {object}
 * @param config.asGenerator {boolean?} Whether to loop through the generator or return it.
 */
export function parse(input, {asGenerator = false} = {}) {
  if (asGenerator) return parser();
  let end;
  for (let v of parser()) {
    end = v;
  }
  return end;

  function* parser() {
    const lens    = new ParserLens;
    const scanner = new Scanner(lens);

    yield* scanner.scan(input);
  }
}