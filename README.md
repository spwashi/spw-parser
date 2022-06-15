# Parser for the Spw language, written in JavaScript


## What this is
This is a ground-up reimplementation of a portion of another package I wrote a while ago - spw-js.

Spw is a language I started developing in college to explore human cognition as it relates to ideological representation. 

The initial use-case was  towards a content-tagging system, but as I implemented it, I realized the basis was way too complex to describe concisely.

So I'm starting over from scratch!


## Description

Spw is a language that is meant to be relatively human.

Right now there are two main token types: 
 - Anchors
 - Phrases

### Anchors

An anchor is a sequence of characters beginning with `[a-zA-Z]` preceded by any number of `[a-zA-Z_]+`

### Phrase

A phrase is a sequence of anchors separated by any number of spaces (` `).