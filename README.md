# Parser for the Spw language, written in JavaScript

## What this is

This is a ground-up reimplementation of a portion of another package I wrote a while ago - spw-js.

Spw is a language I started developing in college to explore human cognition as it relates to ideological
representation.

The initial use case was towards a content-tagging system, but as I implemented it, I realized the basis was way too
complex to describe concisely.

So I'm starting over from scratch!

## Description

Spw is a language that is meant to be relatively human.

Right now there are a few main token categories:

- Node Constructs
    - [Nominal](./src/parser/core/constructs/nodes/nominal)
    - [Numeric](./src/parser/core/constructs/nodes/numeric)
    - [Container](./src/parser/core/constructs/nodes/container)
- Pragmatic Constructs
    - [Operational](./src/parser/core/constructs/pragmatic/operational)
- Semantic Constructs
    - [Ordinal](./src/parser/core/constructs/semantic/ordinal)
    - [Phrasal](./src/parser/core/constructs/semantic/phrasal)
    - [Common](./src/parser/core/constructs/semantic/common)

## Node Constructs

---

Node Constructs represent self-contained units of Identity.

### Nominal Nodes

A Nominal Construct represents an identity.
Nominal Construct Nodes are atomic, and axiomatic.

### Numeric Nodes

Numeric Constructs represent identities that have numeric relationships.
Numeric Construct Nodes have at least 1 of 2 components:

- integral
- fractional

### Container Nodes

Container Constructs represent sets of Nodes and Relationships.
Container Construct Nodes are also called Containers.

There are 4 forms of Containers:

- Conceptual
- Locational
- Structural
- Essential

#### Conceptual Containers

Conceptual Containers describe the boundaries between concepts.
Conceptual Containers introduce ideas.

#### Locational Containers

Locational Containers describe Contextual Relationships of identities.
Locational Containers introduce positions.

Contextual Relationships are categories that describe a dimension of association.

#### Structural Containers

Structural Containers describe Objects.
Structural Containers represent an Object's Intrinsic Identities.

Objective Properties are Identities that exist across Frames.

#### Essential Containers

Essential Containers describe Subjects.
Essential Containers represent an Object's Extrinsic Identities.

--- 

## Pragmatic Constructs

Pragmatic Constructs alter the Subjective Meaning of Identities.

### Operational Constructs

Operational Constructs represent Expressions.

---

## Semantic Constructs

Semantic Constructs describe rules for interpreting the relationships between Nodes in a Container.

### Common Statements

Common Statements describe collections of similar Nodes.

### Ordinal Statements

Ordinal Statements describe Subjectively-interpreted Pragmatic Semantics.  

### Phrasal Statements

Phrasal Statements describe collections of Nodes that share a Semantic Context.

---

## Runtime Constructs

A Runtime Construct represents an Entity that exist in the context of Program Execution.

### Contexts

A Context is a set of Identities that contain the requisite Axioms for describing a Frame's Potential.

### Expressions

An Expression is a Statement that implicitly has Meaning.

### Frames

A Frame is a set of Located Identities that defines Subjective Salience within a Perspective Context.

### Identities

An Identity is something that can be consistently referenced.

### Objects

An Object is a Runtime Construct with Objective Properties.
Objects exist according to The Objective Perspective.

#### The Objective Perspective

A theoretical Perspective that serves as a Point of Reference for other Perspectives

### Perspectives

A Perspective is a Construct that can Perceive Identities and/or Interpret Value.

#### Perception

Perception is the ability to hold a reference to an Identity in some sort of Locational Register.

#### Interpretation

Interpretation is the ability to derive Axioms from a Statement

#### Salience

Salience is a mechanism through which Value can be described.

#### Meaning

Meaning is an Identity that arises from Realizing Value

### Subjects

A Subject is a Runtime Construct that has Identities and Values within a Frame.