import {nominal}     from "../../../nodal/nominal/nominal.mjs";
import {numeric}     from "../../../nodal/numeric/numeric.mjs";
import {phrasal}     from "../../phrasal/phrasal.mjs";
import {container}   from "../../../nodal/container/container.mjs";
import {operational} from "../../../pragmatic/operational/operational.mjs";
import {common}      from "../../common/common.mjs";

export const permittedConstituents = [
  nominal, numeric, container,
  phrasal, common, operational
];