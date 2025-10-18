export type OntologyDisposition = "core" | "heading" | "bias" | "disposition";

export type OntologyDescriptor = {
  disposition: OntologyDisposition;
  heading: string;
  bias: string;
  core: string;
  synopsis: string;
  chemistry: {
    byproducts: string[];
    typing: string[];
  };
  streaming?: {
    chunking: "line" | "element" | "block";
    mode: "synchronous" | "asynchronous";
  };
  search: string[];
  metacommunication: string[];
};

export type OntologyEntry = OntologyDescriptor & {
  extensions: string[];
};

export type OntologyPlane = "intent" | "spatial" | "temporal" | "projection" | "provenance";

export type OntologyAnnotationLocation = {
  plane: OntologyPlane;
  path?: string[];
  offset?: number;
  line?: number;
  chunk?: number;
};

const ONTOLOGY_ENTRIES: OntologyEntry[] = [
  {
    extensions: [".spw"],
    disposition: "core",
    heading: "Fractal Scripts",
    bias: "human-intent",
    core: "Seeds, macros, and generators",
    synopsis:
      "Line-oriented Spw scripts that describe fractal seeds, macros, and generator reuse without embedding heavy data payloads.",
    chemistry: {
      byproducts: ["seed", "pivot", "replica"],
      typing: ["SpwScript"],
    },
    streaming: {
      chunking: "line",
      mode: "synchronous",
    },
    search: ["spw", "script", "fractal", "seed", "macro"],
    metacommunication: [
      "Prefer includes and macros over inline data",
      "Replicate directives should salt ids deterministically",
      "Keep tail text for debugging lineage",
    ],
  },
  {
    extensions: [".jsonl"],
    disposition: "bias",
    heading: "Plumbing Streams",
    bias: "data",
    core: "Beats, projections, reductions",
    synopsis:
      "NDJSON plumbing streams that carry beat timing, projection metadata, and reduction summaries with explicit typing per record.",
    chemistry: {
      byproducts: ["projection", "reduction", "alpha"],
      typing: ["Beat", "Alpha", "NdjsonLine"],
    },
    streaming: {
      chunking: "line",
      mode: "synchronous",
    },
    search: ["jsonl", "ndjson", "beats", "plumbing", "stream"],
    metacommunication: [
      "Each record should end with a newline for stream safety",
      "Explicit type fields accelerate schema negotiation",
      "Chunk-aware parsers must surface partial-line reminders",
    ],
  },
  {
    extensions: [".svg", ".xml"],
    disposition: "heading",
    heading: "Spatial Regions",
    bias: "visual",
    core: "Geometry, accessibility, and inline Spw lenses",
    synopsis:
      "SVG/XML layouts that host spatial regions with accessibility titles/descriptions and inline Spw attributes for local intent.",
    chemistry: {
      byproducts: ["region-index", "accessibility", "lens"],
      typing: ["SvgNode", "XmlElement"],
    },
    streaming: {
      chunking: "element",
      mode: "synchronous",
    },
    search: ["svg", "xml", "region", "a11y", "spw"],
    metacommunication: [
      "Unknown foreign attributes must remain stable for round-trips",
      "Ensure namespaces resolve to https://spw.quest/ns",
      "Annotate groups with <title> and <desc> for debugging",
    ],
  },
];

const EXTENSION_LOOKUP = new Map<string, OntologyDescriptor>();

for (const entry of ONTOLOGY_ENTRIES) {
  for (const extension of entry.extensions) {
    EXTENSION_LOOKUP.set(extension.toLowerCase(), entry);
  }
}

export function listOntology(): OntologyEntry[] {
  return ONTOLOGY_ENTRIES.slice();
}

export function knownExtensions(): string[] {
  return Array.from(EXTENSION_LOOKUP.keys());
}

export function describeExtension(extension: string): OntologyDescriptor | undefined {
  return EXTENSION_LOOKUP.get(extension.toLowerCase());
}

export function describePath(path: string): OntologyDescriptor | undefined {
  const lower = path.toLowerCase();
  for (const [extension, descriptor] of EXTENSION_LOOKUP.entries()) {
    if (lower.endsWith(extension)) {
      return descriptor;
    }
  }
  return undefined;
}

export function assertOntologyForPath(path: string): OntologyDescriptor {
  const descriptor = describePath(path);
  if (!descriptor) {
    throw new Error(`No ontology disposition registered for path: ${path}`);
  }
  return descriptor;
}

export function registerOntologyExtension(extension: string, descriptor: OntologyDescriptor) {
  const key = extension.toLowerCase();
  if (EXTENSION_LOOKUP.has(key)) {
    throw new Error(`Ontology already registered for extension: ${extension}`);
  }
  ONTOLOGY_ENTRIES.push({...descriptor, extensions: [key]});
  EXTENSION_LOOKUP.set(key, descriptor);
}

export type OntologyAnnotation = {
  level: "info" | "warn" | "error";
  message: string;
  context?: Record<string, unknown>;
  at?: OntologyAnnotationLocation;
};
