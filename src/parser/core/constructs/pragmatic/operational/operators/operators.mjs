export const pragmaticOperators =
               {
                 '*': {name: 'salience', key: '*', kind: 'pragmatic'},
                 '@': {name: 'perspective', key: '@', kind: 'pragmatic'},
               };

const openConcept   = {name: 'open-conceptual', key: '<', opposite: '>', kind: 'delimiter'};
const openLocation  = {name: 'open-locational', key: '(', opposite: ')', kind: 'delimiter'};
const openStructure = {name: 'open-structural', key: '{', opposite: '}', kind: 'delimiter'};
const openEssence   = {name: 'open-essential ', key: '[', opposite: ']', kind: 'delimiter'};

const closeConcept   = {name: 'close-conceptual', key: '>', opposite: '<', kind: 'delimiter'};
const closeLocation  = {name: 'close-locational', key: ')', opposite: '(', kind: 'delimiter'};
const closeStructure = {name: 'close-structural', key: '}', opposite: '{', kind: 'delimiter'};
const closeEssence   = {name: 'close-essential ', key: ']', opposite: '[', kind: 'delimiter'};

export const containerDelimitingOperators =
               {
                 '<': openConcept,
                 '>': closeConcept,

                 '(': openLocation,
                 ')': closeLocation,

                 '{': openStructure,
                 '}': closeStructure,

                 '[': openEssence,
                 ']': closeEssence,
               };

export const ordinalDelimitingOperators = {
  ';':  {name: 'ordinal', key: ';', kind: 'delimiter'},
  '\n': {name: 'ordinal', key: ';', kind: 'delimiter'}
};
export const commonDelimitingOperators  = {
  ',': {name: 'common', key: ',', kind: 'delimiter'}
};