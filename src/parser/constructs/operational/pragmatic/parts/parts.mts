import {nominal}     from "../../../nodal/nominal/generator.mts";
import {numeric}     from "../../../nodal/numeric/generator.mts";
import {phrasal}     from "../../semantic/phrasal/generator.mts";
import {operational} from "../generator.mts";
import {container}   from "../../../nodal/container/generator.mts";

export const operationalPartOptions = [
  nominal,
  numeric,
  container,
  phrasal,
  operational
];