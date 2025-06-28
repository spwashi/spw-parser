import {numeric} from './nodal/numeric/generator.mjs';
import {nominal} from './nodal/nominal/generator.mjs';
import {phrasal} from './operational/semantic/phrasal/generator.mjs';
import {common} from './operational/semantic/common/generator.mjs';
import {ordinal} from './operational/semantic/ordinal/generator.mjs';
import {operational} from './operational/pragmatic/generator.mjs';
import {container} from './nodal/container/generator.mjs';
import {literal} from './nodal/literal/generator.mjs';
import {Cursor} from '../../core/node/cursor.mjs';

export interface GeneratorArgs {
  start: Cursor;
  prev?: Cursor;
}

export type ConstructGenerator = (args: GeneratorArgs) => Generator;

type ConstructGeneratorObj = { [key: string]: ConstructGenerator };

export const nodalConstructs: ConstructGeneratorObj     = {literal, container, nominal, numeric};
export const pragmaticConstructs: ConstructGeneratorObj = {operational};
export const semanticConstructs: ConstructGeneratorObj  = {phrasal, common, ordinal};

export const allConstructs: ConstructGeneratorObj = {
  ...nodalConstructs,
  ...pragmaticConstructs,
  ...semanticConstructs,
};