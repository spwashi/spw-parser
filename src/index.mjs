import {parse} from "./parser/parse.mjs";

let out =/**/ {
  '--false':
    [
      " ",
    ],
  '--nominal':
    [
      "one",
    ],
  '--numeric':
    [
      "2",
      "2.2"],
  '--phrasal':
    [
      "2 2",
      "one two",
      "one 2 three",
      "onw two three",
      "{_one two }_three four"
    ],
  '--common':
    [
      "one two, three",
    ],
  '--ordinal':
    [
      "one two, three; four five",
    ],
  '--container':
    [
      "{one}",
      "{ something }",
      "{_one two }_three",
    ],
  '--operational':
    [
      ('one*two'),
      ('one *two'),
      ('one* two'),
      ('one * two'),
      ('one *_two three '),
      ('one@two'),
      ('one * two@three')
    ]
};

out = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.map(str => parse(str, false)?.kind ?? str)]))));
console.log(out);
debugger;