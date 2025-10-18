import {parse} from "../parse.mjs";
import {type OntologyAnnotation} from "./catalog.mjs";

export type SpwParseResult = ReturnType<typeof parse>;

export type SpwScriptAnalysis = {
  raw: string;
  parsed: SpwParseResult | null;
  tail?: string;
  error?: unknown;
  annotations: OntologyAnnotation[];
};

export function parseSpwScript(source: string): SpwScriptAnalysis {
  const annotations: OntologyAnnotation[] = [];
  const trimmed = source.trim();
  if (!trimmed) {
    annotations.push({
      level: "info",
      message: "Empty Spw script provided; nothing to parse",
      at: {plane: "intent"},
    });
    return {raw: source, parsed: null, annotations};
  }

  let attempt = trimmed;
  let tail    = "";

  while (attempt) {
    try {
      const result = parse(attempt.trim(), {asGenerator: false});
      if (result) {
        if (tail) {
          annotations.push({
            level: "info",
            message: "Trailing enclosure preserved for metacommunication",
            context: {tail},
            at: {plane: "intent"},
          });
        }
        return {
          raw:    source,
          parsed: result,
          tail:   tail || undefined,
          annotations,
        };
      }
    } catch (error) {
      annotations.push({
        level: "error",
        message: "Spw parse failed",
        context: {error},
        at: {plane: "intent"},
      });
      return {raw: source, parsed: null, error, tail: tail || undefined, annotations};
    }

    const stripped = stripTrailingSegment(attempt);
    if (!stripped) break;
    attempt = stripped.next.trimEnd();
    tail    = stripped.removed + tail;
  }

  if (tail) {
    annotations.push({
      level: "warn",
      message: "Unable to resolve trailing enclosures",
      context: {tail},
      at: {plane: "intent"},
    });
  }

  return {raw: source, parsed: null, tail: tail || undefined, annotations};
}

export function composeSpwScript(parsed: SpwParseResult | null | undefined) {
  if (!parsed) return "";
  if (typeof parsed === "string") return parsed;
  if (typeof parsed === "object" && parsed !== null && "identity" in parsed) {
    const identity = (parsed as {identity?: unknown}).identity;
    if (identity !== undefined && identity !== null) {
      return String(identity);
    }
  }
  return "";
}

function stripTrailingSegment(value: string) {
  let end = value.length;
  while (end > 0 && isWhitespace(value[end - 1])) {
    end -= 1;
  }
  if (end <= 0) return null;

  if (value[end - 1] === ']') {
    const start = findMatchingOpening(value, '[', ']', end - 1);
    if (start >= 0) {
      let prefixEnd = start;
      while (prefixEnd > 0 && isWhitespace(value[prefixEnd - 1])) {
        prefixEnd -= 1;
      }
      return {
        next:    value.slice(0, prefixEnd),
        removed: value.slice(prefixEnd),
      };
    }
  }

  if (value[end - 1] === '}') {
    const start = findMatchingOpening(value, '{', '}', end - 1);
    if (start >= 1 && value[start - 1] === '?') {
      let prefixEnd = start - 1;
      while (prefixEnd > 0 && isWhitespace(value[prefixEnd - 1])) {
        prefixEnd -= 1;
      }
      return {
        next:    value.slice(0, prefixEnd),
        removed: value.slice(prefixEnd),
      };
    }
  }

  return null;
}

function findMatchingOpening(value: string, openChar: string, closeChar: string, index: number) {
  let depth = 0;
  for (let i = index; i >= 0; i -= 1) {
    const char = value[i];
    if (char === closeChar) {
      depth += 1;
      continue;
    }
    if (char === openChar) {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
}

function isWhitespace(char: string | undefined) {
  return char === ' ' || char === '\n' || char === '\r' || char === '\t';
}
