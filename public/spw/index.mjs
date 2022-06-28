import {parse} from "./parser/parse.mjs";
import util    from 'util';

debugger;
const out = [
  '--false',
  parse(' '),

  '--nominal',
  parse('something'),

  '--numeric',
  parse('2'),
  parse('2.2'),

  '--phrases',
  parse('2 2'),
  parse('one one'),
  parse('one 2 one'),
  parse('this is something'),

  '--common',
  parse('one one, one'),

  '--ordinal',
  parse('one one, one; one one'),

  '--containers',
  parse('{one}'),
  parse('{ something }'),
  parse('{_boon something }_other'),
  parse('{_boon something }_other another'),

  '--operators',
  parse('something@another'),

  parse('one*one'),
  parse('one *one'),
  parse('one* one'),
  parse('one * one'),

  parse('one * two@three'),
];

console.log(util.inspect(out, {depth: undefined, colors: true}));

debugger;