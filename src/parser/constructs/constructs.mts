import {numeric}     from "./nodal/numeric/generator.mts";
import {nominal}     from "./nodal/nominal/generator.mts";
import {phrasal}     from "./operational/semantic/phrasal/generator.mts";
import {common}      from "./operational/semantic/common/generator.mts";
import {ordinal}     from "./operational/semantic/ordinal/generator.mts";
import {operational} from "./operational/pragmatic/generator.mts";
import {container}   from "./nodal/container/generator.mts";
import {literal}     from "./nodal/literal/generator.mts";

export const nodalConstructs     = {literal, container, nominal, numeric};
export const pragmaticConstructs = {operational};
export const semanticConstructs  = {phrasal, common, ordinal};

export const allConstructs = {
  ...nodalConstructs,
  ...pragmaticConstructs,
  ...semanticConstructs,
};