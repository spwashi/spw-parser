import {Scanner}         from "../core/lens/scanner.mjs";
import {allConstructs}   from "./constructs/constructs.mjs";
import {Lens}            from "../core/lens/lens.mjs";
import {CharacterCursor} from "../core/cursor/cursor.mjs";


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
export function parse(input: string, {asGenerator = false} = {}) {
  if (asGenerator) return parser();
  let end;
  for (const v of parser()) {
    end = v;
  }
  return end;

  function* parser() {
    const lens    = new ParserLens;
    const scanner = new Scanner(lens);

    yield* scanner.scan(input);
  }
}