import {parse} from "./parser/parse.mjs";

if (typeof window !== "undefined") window.parse = parse;

console.log(
  [
    parse('this is something'),
    parse(' '),
    parse('something'),
    parse('2'),
    parse('2 2'),
    parse('one one'),
    parse('one 2 one'),
  ]
);

// debugger;