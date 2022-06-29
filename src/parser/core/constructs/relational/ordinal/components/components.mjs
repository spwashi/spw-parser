import {nominal}     from "../../../atomic/nominal/nominal.mjs";
import {numeric}     from "../../../atomic/numeric/numeric.mjs";
import {phrasal}     from "../../phrasal/phrasal.mjs";
import {containing}  from "../../../atomic/containing/containing.mjs";
import {operational} from "../../../operational/operational.mjs";
import {common}      from "../../common/common.mjs";

export const permittedConstituents = [
  nominal, numeric, containing,
  phrasal, common, operational
];