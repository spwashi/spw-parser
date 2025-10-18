import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from '../public/js/parser/parse.mjs';

test('parses numeric token', () => {
  const token = parse('2', { asGenerator: false });
  assert.equal(token.kind, 'numeric');
});

test('parses phrasal token', () => {
  const token = parse('2 2', { asGenerator: false });
  assert.equal(token.kind, 'phrasal');
});

test('parses seed specification', () => {
  const fixture = fs.readFileSync(new URL('./fixtures/seed.spw', import.meta.url), 'utf8');
  const token = parse(fixture, { asGenerator: false });
  assert.ok(token);
  assert.equal(token.kind, 'operational pragmatic meta');
});
