import {parseSpwScript, composeSpwScript} from "./spw.mjs";
import {type OntologyAnnotation} from "./catalog.mjs";

export type SpwSvgNode = {
  tagName: string;
  id?: string;
  attributes: Record<string, string>;
  spwAttributes: Record<string, string>;
  tag?: {
    raw: string;
    result: ReturnType<typeof parseSpwScript> | null;
  };
  path: string[];
};

export type SpwSvgScript = {
  raw: string;
  result: ReturnType<typeof parseSpwScript> | null;
  path: string[];
};

export type SpwSvgParseResult = {
  namespaces: Record<string, string>;
  nodes: SpwSvgNode[];
  scripts: SpwSvgScript[];
  annotations: OntologyAnnotation[];
};

type StackEntry = {
  tagName: string;
  index: number;
  pathSegment: string;
};

type Counts = Map<string, number>;

const EXPECTED_NAMESPACE = "https://spw.quest/ns";

export function parseSpwSvg(source: string): SpwSvgParseResult {
  const namespaces: Record<string, string> = {};
  const nodes: SpwSvgNode[]   = [];
  const scripts: SpwSvgScript[] = [];
  const annotations: OntologyAnnotation[] = [];

  const stack: StackEntry[] = [];
  const countsPerDepth: Counts[] = [new Map()];

  let index = 0;

  while (index < source.length) {
    const openIndex = source.indexOf('<', index);
    if (openIndex === -1) break;

    const tag = readTag(source, openIndex + 1);
    if (!tag) break;

    index = tag.end + 1;

    const trimmed = tag.content.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('!--') || trimmed.startsWith('![CDATA[') || trimmed.startsWith('?')) {
      continue;
    }

    const isClosing = trimmed.startsWith('/');
    if (isClosing) {
      stack.pop();
      countsPerDepth.length = stack.length + 1;
      continue;
    }

    const {tagName, attributeText, selfClosing} = splitTagContent(trimmed);

    const depth = stack.length;
    const nodeIndex = nextIndex(countsPerDepth, depth, tagName);
    const path = stack.map(entry => entry.pathSegment).concat(`${tagName}[${nodeIndex}]`);

    const attributes = parseAttributes(attributeText);
    const spwAttributes: Record<string, string> = {};
    let tagAttr: SpwSvgNode["tag"];

    for (const [name, value] of Object.entries(attributes)) {
      if (name.startsWith("xmlns:")) {
        namespaces[name.slice(6)] = value;
      }

      if (name.startsWith("spw:")) {
        const key = name.slice(4);
        spwAttributes[key] = value;

        if (key === "tag") {
          const result = safeParseSpw(value, path);
          tagAttr = {raw: value, result};
        }
      }
    }

    if (Object.keys(spwAttributes).length > 0) {
      nodes.push({
        tagName,
        id: attributes.id,
        attributes,
        spwAttributes,
        tag: tagAttr,
        path,
      });
      if (!attributes.id) {
        annotations.push({
          level: "warn",
          message: "SVG node with spw attributes is missing a stable id",
          context: {path},
          at: {plane: "spatial", path},
        });
      }
    }

    if (tagName === "spw:script") {
      const rawBlock = readUntilClose(source, index, tagName);
      index          = rawBlock.end;
      const body     = unwrapCdata(rawBlock.content).trim();
      const result   = body ? safeParseSpw(body, path) : null;
      scripts.push({raw: body, result, path});
      if (!body) {
        annotations.push({
          level: "info",
          message: "Encountered empty spw:script block",
          context: {path},
          at: {plane: "spatial", path},
        });
      }
      continue;
    }

    if (!selfClosing) {
      stack.push({tagName, index: nodeIndex, pathSegment: `${tagName}[${nodeIndex}]`});
      countsPerDepth[stack.length] = new Map();
    }
  }

  if (namespaces.spw && namespaces.spw !== EXPECTED_NAMESPACE) {
    annotations.push({
      level: "warn",
      message: "spw namespace differs from expected value",
      context: {namespace: namespaces.spw, expected: EXPECTED_NAMESPACE},
      at: {plane: "spatial"},
    });
  } else if (!namespaces.spw) {
    annotations.push({
      level: "error",
      message: "Missing spw namespace declaration",
      at: {plane: "spatial"},
    });
  }

  return {namespaces, nodes, scripts, annotations};
}

export function composeSpwTag(tag: SpwSvgNode["tag"] | undefined | null) {
  if (!tag?.result) return tag?.raw ?? "";
  const head = composeSpwScript((tag.result as any).parsed);
  const tail = (tag.result as any).tail ?? "";
  return head + tail;
}

function safeParseSpw(value: string, path: string[]) {
  try {
    const analysis = parseSpwScript(value);
    if (analysis.annotations.length === 0) return analysis;
    return {
      ...analysis,
      annotations: analysis.annotations.map(annotation => {
        const existingAt = annotation.at ?? {plane: "intent"};
        return {
          ...annotation,
          at: {
            ...existingAt,
            plane: existingAt.plane ?? "intent",
            path: path.slice(),
          },
        };
      }),
    };
  } catch (error) {
    const annotation: OntologyAnnotation = {
      level: "error",
      message: "Inline Spw parse failed",
      context: {error},
      at: {plane: "intent", path: path.slice()},
    };
    return {raw: value, parsed: null, error, annotations: [annotation]};
  }
}

function readTag(source: string, start: number) {
  let i = start;
  let quote: string | null = null;
  while (i < source.length) {
    const char = source[i];
    if (quote) {
      if (char === quote) quote = null;
      i += 1;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      i += 1;
      continue;
    }
    if (char === '>') {
      return {
        end:     i,
        content: source.slice(start, i),
      };
    }
    i += 1;
  }
  return null;
}

function splitTagContent(content: string) {
  let cursor = 0;
  const length = content.length;

  while (cursor < length && !isWhitespace(content[cursor])) {
    cursor += 1;
  }

  const tagName = content.slice(0, cursor);
  let attributeText = content.slice(cursor);

  let selfClosing = false;
  if (attributeText.trim().endsWith('/')) {
    selfClosing   = true;
    attributeText = attributeText.trim().slice(0, -1);
  }

  return {tagName, attributeText, selfClosing};
}

function parseAttributes(attributeText: string) {
  const attributes: Record<string, string> = {};
  let cursor = 0;

  while (cursor < attributeText.length) {
    while (cursor < attributeText.length && isWhitespace(attributeText[cursor])) {
      cursor += 1;
    }
    if (cursor >= attributeText.length) break;

    const nameStart = cursor;
    while (cursor < attributeText.length && !isWhitespace(attributeText[cursor]) && attributeText[cursor] !== '=') {
      cursor += 1;
    }

    const name = attributeText.slice(nameStart, cursor);

    while (cursor < attributeText.length && isWhitespace(attributeText[cursor])) {
      cursor += 1;
    }

    if (attributeText[cursor] !== '=') {
      attributes[name] = "";
      continue;
    }

    cursor += 1;

    while (cursor < attributeText.length && isWhitespace(attributeText[cursor])) {
      cursor += 1;
    }

    let quote: string | null = null;
    if (attributeText[cursor] === '"' || attributeText[cursor] === "'") {
      quote = attributeText[cursor];
      cursor += 1;
    }

    let valueStart = cursor;
    if (quote) {
      while (cursor < attributeText.length && attributeText[cursor] !== quote) {
        cursor += 1;
      }
      const value = attributeText.slice(valueStart, cursor);
      attributes[name] = value;
      if (cursor < attributeText.length) cursor += 1;
    } else {
      while (cursor < attributeText.length && !isWhitespace(attributeText[cursor])) {
        cursor += 1;
      }
      attributes[name] = attributeText.slice(valueStart, cursor);
    }
  }

  return attributes;
}

function readUntilClose(source: string, start: number, tagName: string) {
  const closeTag = `</${tagName}>`;
  const closeIndex = source.indexOf(closeTag, start);
  const end = closeIndex === -1 ? source.length : closeIndex + closeTag.length;
  const content = source.slice(start, closeIndex === -1 ? source.length : closeIndex);
  return {content, end};
}

function unwrapCdata(content: string) {
  if (content.startsWith('<![CDATA[') && content.endsWith(']]>')) {
    return content.slice(9, -3);
  }
  return content;
}

function nextIndex(countsPerDepth: Counts[], depth: number, tagName: string) {
  let counts = countsPerDepth[depth];
  if (!counts) {
    counts = new Map();
    countsPerDepth[depth] = counts;
  }
  const next = (counts.get(tagName) ?? 0) + 1;
  counts.set(tagName, next);
  return next - 1;
}

function isWhitespace(char: string | undefined) {
  return char === ' ' || char === '\n' || char === '\r' || char === '\t';
}
