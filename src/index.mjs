import {parse} from "./parser/parse.mjs";

let out =/**/ [
  '--false',
  parse(' '),

  '--nominal',
  parse('one'),

  '--numeric',
  parse('2'),
  parse('2.2'),

  '--phrasal',
  parse('2 2'),
  parse('one two'),
  parse('one 2 three'),
  parse('onw two three'),

  '--common',
  parse('one two, three'),

  '--ordinal',
  parse('one two, three; four five'),

  '--container',
  parse('{one}'),
  parse('{ something }'),
  parse('{_one two }_three'),
  parse('{_one two }_three four'),

  '--operational',


  parse('one*two'),
  parse('one *two'),
  parse('one* two'),
  parse('one * two'),
  parse('one *_two three '),

  parse('one@two'),
  parse('one * two@three'),
];

out = JSON.parse(JSON.stringify(out));
console.log(out);
debugger;