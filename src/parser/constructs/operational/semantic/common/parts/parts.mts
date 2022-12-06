import {nominal}   from "../../../../nodal/nominal/generator.mts";
import {numeric}   from "../../../../nodal/numeric/generator.mts";
import {phrasal}   from "../../phrasal/generator.mts";
import {container} from "../../../../nodal/container/generator.mts";

export const commonPartOptions = [
  nominal,
  numeric,
  container,
  phrasal,
];