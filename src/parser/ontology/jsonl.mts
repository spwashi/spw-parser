import {type OntologyAnnotation} from "./catalog.mjs";

export type JsonlEntry<T = unknown> = {
  line: number;
  raw: string;
  value: T;
  chunk: number;
  offset: number;
};

export type JsonlParseError = {
  line: number;
  raw: string;
  message: string;
  chunk: number;
  offset: number;
};

export type JsonlParseResult<T = unknown> = {
  entries: JsonlEntry<T>[];
  errors: JsonlParseError[];
  remainder: string;
  chunks: number;
  annotations: OntologyAnnotation[];
};

export type JsonlChunkParser<T = unknown> = {
  push(chunk: string): {
    entries: JsonlEntry<T>[];
    errors: JsonlParseError[];
    annotations: OntologyAnnotation[];
  };
  finish(): JsonlParseResult<T>;
  snapshot(): JsonlParseResult<T>;
};

export function createJsonlChunkParser<T = unknown>(): JsonlChunkParser<T> {
  let chunkIndex = 0;
  let lineNumber = 0;
  let remainder = "";
  let processedOffset = 0;

  const entries: JsonlEntry<T>[] = [];
  const errors: JsonlParseError[] = [];
  const annotations: OntologyAnnotation[] = [];

  function parseLine(
    raw: string,
    chunk: number,
    offset: number,
    localEntries: JsonlEntry<T>[],
    localErrors: JsonlParseError[],
    localAnnotations: OntologyAnnotation[],
  ) {
    const trimmed = raw.trim();
    if (!trimmed) {
      localAnnotations.push({
        level: "info",
        message: "Skipping empty JSONL line",
        context: {line: lineNumber, chunk},
        at: {plane: "temporal", line: lineNumber, chunk, offset},
      });
      return;
    }

    try {
      const value = JSON.parse(trimmed) as T;
      const entry = {line: lineNumber, raw, value, chunk, offset};
      entries.push(entry);
      localEntries.push(entry);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to parse JSON";
      const parseError = {
        line: lineNumber,
        raw,
        message,
        chunk,
        offset,
      };
      errors.push(parseError);
      localErrors.push(parseError);
      localAnnotations.push({
        level: "error",
        message: "Unable to parse JSON",
        context: {line: lineNumber, chunk},
        at: {plane: "temporal", line: lineNumber, chunk, offset},
      });
    }
  }

  function flushRemainder(chunk: number, localAnnotations: OntologyAnnotation[]) {
    const tail = remainder;
    if (!tail) return;
    const trimmed = tail.trim();
    if (!trimmed) {
      localAnnotations.push({
        level: "info",
        message: "Trailing whitespace discarded from JSONL stream",
        at: {plane: "temporal", line: lineNumber, chunk, offset: processedOffset},
      });
      processedOffset += tail.length;
      remainder = "";
      return;
    }

    const offset = processedOffset;
    lineNumber += 1;
    parseLine(tail, chunk, offset, [], [], localAnnotations);
    processedOffset += tail.length;
    annotations.push({
      level: "warn",
      message: "Parsed terminal line without newline terminator",
      context: {line: lineNumber},
      at: {plane: "temporal", line: lineNumber, chunk, offset},
    });
    remainder = "";
  }

  return {
    push(chunk: string) {
      chunkIndex += 1;
      const localEntries: JsonlEntry<T>[] = [];
      const localErrors: JsonlParseError[] = [];
      const localAnnotations: OntologyAnnotation[] = [];

      localAnnotations.push({
        level: "info",
        message: "Processed JSONL chunk",
        context: {chunk: chunkIndex, size: chunk.length},
        at: {plane: "temporal", chunk: chunkIndex, offset: processedOffset},
      });

      remainder += chunk;

      while (true) {
        const newlineIndex = remainder.indexOf("\n");
        if (newlineIndex === -1) break;

        const line = remainder.slice(0, newlineIndex);
        const offset = processedOffset;
        remainder = remainder.slice(newlineIndex + 1);

        lineNumber += 1;
        parseLine(line, chunkIndex, offset, localEntries, localErrors, localAnnotations);
        processedOffset += line.length + 1;
      }

      annotations.push(...localAnnotations);
      return {entries: localEntries, errors: localErrors, annotations: localAnnotations};
    },
    finish() {
      const localAnnotations: OntologyAnnotation[] = [];
      flushRemainder(chunkIndex, localAnnotations);
      annotations.push(...localAnnotations);
      return {
        entries:    entries.slice(),
        errors:     errors.slice(),
        remainder,
        chunks:     chunkIndex,
        annotations: annotations.slice(),
      };
    },
    snapshot() {
      return {
        entries:    entries.slice(),
        errors:     errors.slice(),
        remainder,
        chunks:     chunkIndex,
        annotations: annotations.slice(),
      };
    },
  };
}

export function parseJsonlStream<T = unknown>(source: string | Iterable<string>): JsonlParseResult<T> {
  const parser = createJsonlChunkParser<T>();
  if (typeof source === "string") {
    parser.push(source);
  } else {
    for (const chunk of source) {
      parser.push(chunk);
    }
  }
  return parser.finish();
}

export function collectJsonlIds(result: JsonlParseResult) {
  const ids: string[] = [];
  for (const entry of result.entries) {
    if (typeof entry.value === "object" && entry.value !== null) {
      const maybeId = (entry.value as Record<string, unknown>).id;
      if (typeof maybeId === "string") {
        ids.push(maybeId);
      }
    }
  }
  return ids;
}
