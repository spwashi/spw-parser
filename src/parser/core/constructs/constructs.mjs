import {numeric}     from "./nodal/numeric/numeric.mjs";
import {nominal}     from "./nodal/nominal/nominal.mjs";
import {phrasal}     from "./semantic/phrasal/phrasal.mjs";
import {common}      from "./semantic/common/common.mjs";
import {ordinal}     from "./semantic/ordinal/ordinal.mjs";
import {operational} from "./pragmatic/operational/operational.mjs";
import {container}   from "./nodal/container/container.mjs";

export const nodalConstructs     = {numeric, nominal, container};
export const pragmaticConstructs = {operational};
export const semanticConstructs  = {phrasal, common, ordinal};

export const allConstructs = {
  ...nodalConstructs,
  ...pragmaticConstructs,
  ...semanticConstructs,
};