import {nominal}     from "../../../nodes/nominal/nominal.mjs";
import {numeric}     from "../../../nodes/numeric/numeric.mjs";
import {phrasal}     from "../../../semantic/phrasal/phrasal.mjs";
import {common}      from "../../../semantic/common/common.mjs";
import {ordinal}     from "../../../semantic/ordinal/ordinal.mjs";
import {operational} from "../operational.mjs";

export const permittedConstituents = [
  nominal, numeric,
  phrasal, common, ordinal,
  operational
];