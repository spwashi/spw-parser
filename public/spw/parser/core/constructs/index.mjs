import {numeric}   from "./atomic/numeric/numeric.mjs";
import {nominal}   from "./atomic/nominal/nominal.mjs";
import {phrasal}   from "./relational/phrasal/phrasal.mjs";
import {common}    from "./relational/common/common.mjs";
import {ordinal}     from "./relational/ordinal/ordinal.mjs";
import {operational} from "./operational/operation/operational.mjs";
import {containing}  from "./atomic/container/containing.mjs";

const atomic      = [numeric, nominal, containing];
const relational  = [phrasal, common, ordinal];

export const ALL_GENERATORS = [
  ...atomic,
  ...relational,
  operational,
];