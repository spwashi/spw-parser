import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../parse.mjs';

const cases: [string, string | false][] = [
  [' ', false],

  // nominal examples
  ['one', 'nominal'],
  ['one<two>', 'nominal'],
  ['one<two>(three)', 'nominal'],
  ['one(two)', 'nominal'],
  ['one(two){three}', 'nominal'],
  ['one{two}', 'nominal'],
  ['one(two){three}[four]', 'nominal'],
  ['one{two}[three]', 'nominal'],
  ['one[two]', 'nominal'],

  // literal examples
  ['`one`', 'literal'],
  ['"one"', 'literal'],

  // numeric examples
  ['2', 'numeric'],
  ['2.2', 'numeric'],

  // phrasal examples
  ['2 2', 'phrasal'],
  ['one two', 'phrasal'],
  ['one 2 three', 'phrasal'],
  ['onw two three', 'phrasal'],
  ['{_one two }_three four', 'phrasal'],

  // common examples
  ['one two, three', 'common'],

  // ordinal examples
  ['one two, three; four five', 'ordinal'],
  [`\n      one\n      two \n      three\n      `, 'ordinal'],
  [`\n      one;\n      two;\n      three;\n      `, 'ordinal'],
  [`\n      one;\n      *_two;\n      three;\n      `, 'ordinal'],

  // container examples
  ['{one}', 'container structural'],
  ['{ something }', 'container structural'],
  ['{_one two }_three', 'container structural'],

  // operational examples
  ['one*two', 'operational pragmatic salience'],
  ['*_one', 'operational pragmatic salience conceptual'],
  ['one *two', 'operational pragmatic salience'],
  ['one* two', 'operational pragmatic salience'],
  ['one * two', 'operational pragmatic salience'],
  ['one *_two three ', 'operational pragmatic salience'],
  ['one@two', 'operational pragmatic perspective'],
  ['one * two@three', 'operational pragmatic salience'],
];

// examples from demo.spw
cases.push(
  ['Metric', 'nominal'],
  ['Command', 'nominal'],
  ['metric_bus', 'nominal'],
  ['command_bus', 'nominal'],
  ['log_bus', 'nominal'],
  ['bootstrap', 'nominal'],
  ['ticker', 'nominal'],
  ['echo', 'nominal'],
  ['log("\ud83c\udfc1 bootstrapping…")', 'nominal'],
  ['now()', 'nominal'],
  ['sleep_ms(*TICK_MS)', 'nominal'],
  ['<chan[Metric]>', 'container conceptual'],
  ['@view', 'operational pragmatic perspective'],
  ['"\ud83c\udf33 Playground active — press Ctrl-C to quit\\n"', 'literal'],
);

for (const [input, expected] of cases) {
  test(`${JSON.stringify(input)} -> ${expected}`, () => {
    const result = parse(input, { asGenerator: false });
    if (expected === false) {
      assert.equal(result, false);
    } else {
      assert.ok(result);
      assert.equal(result.kind, expected);
    }
  });
}
