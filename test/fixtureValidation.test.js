import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {parseSpwSvg} from '../public/js/parser/ontology/index.mjs';

const beatSchema = JSON.parse(
  fs.readFileSync(new URL('./schemas/plumbing.beat.schema.json', import.meta.url), 'utf8'),
);
const alphaSchema = JSON.parse(
  fs.readFileSync(new URL('./schemas/plumbing.alpha.schema.json', import.meta.url), 'utf8'),
);

function validateBeat(entry) {
  assert.equal(entry.type, 'beat', 'beat entries must declare a type');
  assert.ok(Number.isInteger(entry.t) && entry.t >= 0, 'beats expose a non-negative integer time');
  assert.equal(typeof entry.id, 'string');
  assert.notEqual(entry.id.trim(), '', 'beats require an id');
  assert.equal(typeof entry.role, 'string');
  assert.notEqual(entry.role.trim(), '', 'beats require a role');
  assert.equal(typeof entry.svg_id, 'string');
  assert.notEqual(entry.svg_id.trim(), '', 'beats require an svg_id');
  if (entry.span !== undefined) {
    assert.ok(Array.isArray(entry.span), 'span should be an array');
    assert.equal(entry.span.length, 2, 'span must be a [start,end] tuple');
  }
}

function validateAlpha(entry) {
  assert.equal(entry.type, 'alpha');
  assert.equal(typeof entry.alpha, 'string');
  assert.ok(entry.alpha.length > 0 && entry.alpha.length <= 64);
  assert.equal(typeof entry.legend, 'object');
}

test('plumbing fixtures validate against schemas', () => {
  const fixtureUrl = new URL('./fixtures/plumbing.jsonl', import.meta.url);
  const content = fs.readFileSync(fixtureUrl, 'utf8');

  assert.ok(content.endsWith('\n'), 'NDJSON fixture should end with a newline');
  assert.equal(beatSchema.properties.type.const, 'beat');
  assert.equal(alphaSchema.properties.type.const, 'alpha');

  const lines = content.trim().split(/\r?\n/);
  for (const line of lines) {
    const parsed = JSON.parse(line);
    if (parsed.type === 'alpha') {
      validateAlpha(parsed);
    } else {
      validateBeat(parsed);
    }
  }
});

test('spw jsonl pattern fixture mirrors plumbing typing', () => {
  const content = fs.readFileSync(new URL('./fixtures/pattern.jsonl', import.meta.url), 'utf8');
  assert.ok(content.endsWith('\n'), 'pattern fixture should end with a newline');
  const lines = content.trim().split(/\r?\n/);
  const types = lines.map(line => JSON.parse(line).type);
  assert.deepEqual(types, ['beat', 'beat', 'alpha']);
});

const NS = 'https://spw.quest/ns';

test('inline svg fixture preserves namespace and accessibility metadata', () => {
  const content = fs.readFileSync(new URL('./fixtures/inline.svg', import.meta.url), 'utf8');
  const svg = parseSpwSvg(content);

  assert.equal(svg.namespaces.spw, NS);
  assert.ok(svg.annotations.every(note => note.level !== 'error'), 'namespace parsing should not raise errors');
  for (const node of svg.nodes) {
    assert.ok(node.id, `expected node ${node.path.join('>')} to expose a stable id`);
  }

  const groupMatch = content.match(/<g[^>]*id="L-beam-01"[\s\S]*?<\/g>/);
  assert.ok(groupMatch, 'expected beam group to be present');
  assert.match(groupMatch[0], /<title>[\s\S]*?<\/title>/);
  assert.match(groupMatch[0], /<desc>[\s\S]*?<\/desc>/);
});

test('fractal spw fixtures provide deterministic replica ids', () => {
  const fractal = fs.readFileSync(new URL('./fixtures/fractal.spw', import.meta.url), 'utf8');
  const roundtrip = fs.readFileSync(new URL('./fixtures/roundtrip.spw', import.meta.url), 'utf8');

  for (const script of [fractal, roundtrip]) {
    assert.match(
      script,
      /ids:\[xh0C9K#1,xh0C9K#2\]/,
      'replicate directives should enumerate deterministic ids',
    );
  }
});
