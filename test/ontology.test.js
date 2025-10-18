import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  assertOntologyForPath,
  collectJsonlIds,
  composeSpwScript,
  composeSpwTag,
  createJsonlChunkParser,
  describePath,
  knownExtensions,
  parseJsonlStream,
  parseSpwScript,
  parseSpwSvg,
} from '../public/js/parser/ontology/index.mjs';

test('describes supported ontology dispositions', () => {
  const spw = describePath('scene.spw');
  assert.ok(spw, 'expected .spw disposition');
  assert.equal(spw.disposition, 'core');
  assert.equal(spw.bias, 'human-intent');

  const jsonl = assertOntologyForPath('beats.JSONL');
  assert.equal(jsonl.disposition, 'bias');
  assert.equal(jsonl.streaming?.chunking, 'line');

  const svg = assertOntologyForPath('layout.svg');
  assert.equal(svg.disposition, 'heading');

  assert.ok(knownExtensions().includes('.svg'));
  assert.equal(describePath('notes.txt'), undefined);
});

test('parses inline Spw script fixtures and surfaces annotations', () => {
  const fixture = fs.readFileSync(new URL('./fixtures/pattern.spw', import.meta.url), 'utf8');
  const result  = parseSpwScript(fixture);
  assert.ok(result.parsed, 'expected parse result');
  assert.ok(result.parsed.identity);
  assert.match(composeSpwScript(result.parsed), /^N:/);
  assert.ok(Array.isArray(result.annotations));
});

test('supports chunked jsonl parsing with streaming metadata', () => {
  const fixture = fs.readFileSync(new URL('./fixtures/pattern.jsonl', import.meta.url), 'utf8');
  const chunks = [fixture.slice(0, 40), fixture.slice(40)];
  const parser = createJsonlChunkParser();

  for (const chunk of chunks) {
    parser.push(chunk);
  }

  const snapshot = parser.snapshot();
  assert.equal(snapshot.chunks, chunks.length);
  assert.equal(snapshot.errors.length, 0);
  assert.ok(snapshot.annotations.length > 0);

  const finished = parser.finish();
  assert.equal(finished.entries.length, 3);
  assert.equal(finished.remainder, '');
  assert.equal(finished.entries[0].offset, 0);
  const offsets = finished.entries.map(entry => entry.offset);
  for (let i = 1; i < offsets.length; i += 1) {
    assert.ok(offsets[i] > offsets[i - 1], 'offsets should be strictly increasing');
  }
  assert.ok(finished.annotations.every(note => note.at?.plane === 'temporal'));
  const ids = collectJsonlIds(finished);
  assert.deepEqual(ids, ['xhA3QW', 'xh0C9K']);
});

test('parses spw inline attributes from svg with quest namespace', () => {
  const fixture = fs.readFileSync(new URL('./fixtures/pattern.svg', import.meta.url), 'utf8');
  const svg = parseSpwSvg(fixture);

  assert.equal(svg.namespaces.spw, 'https://spw.quest/ns');
  assert.ok(svg.annotations.every(note => note.level !== 'error'));
  assert.equal(svg.nodes.length, 1);
  const node = svg.nodes[0];
  assert.equal(node.tagName, 'g');
  assert.equal(node.id, 'L-beam-01');
  assert.ok(node.tag?.result?.parsed);
  const recomposed = composeSpwTag(node.tag);
  assert.equal(
    recomposed.replace(/\s+/g, ''),
    node.spwAttributes.tag.replace(/\s+/g, ''),
  );

  assert.equal(svg.scripts.length, 1);
  const script = svg.scripts[0];
  assert.ok(script.result?.parsed);
  assert.match(composeSpwScript(script.result.parsed), /seed\[/);
});

test('parseJsonlStream normalises iterable input for chunking', () => {
  const fixture = fs.readFileSync(new URL('./fixtures/pattern.jsonl', import.meta.url), 'utf8');
  const iterable = [fixture.slice(0, 20), fixture.slice(20, 60), fixture.slice(60)];
  const result = parseJsonlStream(iterable);
  assert.equal(result.entries.length, 3);
  assert.equal(result.chunks, iterable.length);
  assert.equal(result.errors.length, 0);
});

test('inline svg analysis threads intent annotations to node paths', () => {
  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:spw="https://spw.quest/ns">
      <g id="node-01" spw:tag="">
        <title>Empty intent</title>
        <desc>placeholder</desc>
      </g>
    </svg>
  `;
  const svg = parseSpwSvg(svgMarkup);
  const node = svg.nodes[0];
  assert.ok(node, 'expected tagged node to be discovered');
  const analysis = node.tag?.result;
  assert.ok(analysis, 'expected inline analysis for empty tag');
  const annotation = analysis.annotations.find(note => note.message.includes('Empty Spw script'));
  assert.ok(annotation, 'expected empty script annotation');
  assert.deepEqual(annotation.at?.path, node.path);
  assert.equal(annotation.at?.plane, 'intent');
});
