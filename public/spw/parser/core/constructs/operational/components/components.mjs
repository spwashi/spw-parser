import {nominal}     from "../../atomic/nominal/nominal.mjs";
import {numeric}     from "../../atomic/numeric/numeric.mjs";
import {phrasal}     from "../../relational/phrasal/phrasal.mjs";
import {common}      from "../../relational/common/common.mjs";
import {ordinal}     from "../../relational/ordinal/ordinal.mjs";
import {operational} from "../operational.mjs";

export const permittedConstituents = [
  nominal, numeric,
  phrasal, common, ordinal,
  operational
];