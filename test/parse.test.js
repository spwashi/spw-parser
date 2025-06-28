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

test('parses token from demo script', () => {
  const token = parse('log("\ud83c\udfc1 bootstrapping…")', { asGenerator: false });
  assert.equal(token.kind, 'nominal');
});

test('parses demo container token', () => {
  const token = parse('<chan[Metric]>', { asGenerator: false });
  assert.equal(token.kind, 'container conceptual');
});

test('parses demo operational token', () => {
  const token = parse('@view', { asGenerator: false });
  assert.equal(token.kind, 'operational pragmatic perspective');
});
