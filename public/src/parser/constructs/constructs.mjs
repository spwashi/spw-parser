import {numeric}     from "./nodal/numeric/generator.mjs";
import {nominal}     from "./nodal/nominal/generator.mjs";
import {phrasal}     from "./operational/semantic/phrasal/generator.mjs";
import {common}      from "./operational/semantic/common/generator.mjs";
import {ordinal}     from "./operational/semantic/ordinal/generator.mjs";
import {operational} from "./operational/pragmatic/generator.mjs";
import {container}   from "./nodal/container/generator.mjs";
import {literal}     from "./nodal/literal/generator.mjs";

export const nodalConstructs     = {literal, container, nominal, numeric};
export const pragmaticConstructs = {operational};
export const semanticConstructs  = {phrasal, common, ordinal};

export const allConstructs = {
  ...nodalConstructs,
  ...pragmaticConstructs,
  ...semanticConstructs,
};