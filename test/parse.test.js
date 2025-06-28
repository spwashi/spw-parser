import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../public/js/parser/parse.mjs';

test('parses numeric token', () => {
  const token = parse('2', { asGenerator: false });
  assert.equal(token.kind, 'numeric');
});

test('parses phrasal token', () => {
  const token = parse('2 2', { asGenerator: false });
  assert.equal(token.kind, 'phrasal');
});
