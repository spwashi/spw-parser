import {numeric} from "./nodes/numeric/numeric.mjs";
import {nominal}     from "./nodes/nominal/nominal.mjs";
import {phrasal} from "./semantic/phrasal/phrasal.mjs";
import {common}  from "./semantic/common/common.mjs";
import {ordinal}     from "./semantic/ordinal/ordinal.mjs";
import {operational} from "./pragmatic/operational/operational.mjs";
import {container}   from "./nodes/container/container.mjs";

const nodes     = [numeric, nominal, container];
const pragmatic = [operational];
const semantic  = [phrasal, common, ordinal];

export const ALL_GENERATORS = [
  ...nodes,
  ...pragmatic,
  ...semantic,
];