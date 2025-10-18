export const pragmaticOperators =
               {
                 '*': {
                   name:  'salience',
                   key:   '*',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '^': {
                   name:  'meta',
                   key:   '^',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '#': {
                   name:  'macro',
                   key:   '#',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '~': {
                   name:  'style',
                   key:   '~',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '@': {
                   name:  'perspective',
                   key:   '@',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '?': {
                   name:  'query',
                   key:   '?',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '!': {
                   name:  'accent',
                   key:   '!',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '\'': {
                   name:  'hold',
                   key:   '\'',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '°': {
                   name:  'snap',
                   key:   '°',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 ':': {
                   name:  'binding',
                   key:   ':',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '+': {
                   name:  'aggregation',
                   key:   '+',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '-': {
                   name:  'reduction',
                   key:   '-',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                   nodes: {
                     '>': {
                       name:  'flow',
                       key:   '->',
                       kind:  'pragmatic',
                       kinds: new Set(['pragmatic', 'nominal']),
                     }
                   }
                 },
                 '<': {
                   name:  'lessThan',
                   key:   '<',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                   nodes: {
                     '=': {
                       name:  'lessThanOrEqual',
                       key:   '<=',
                       kind:  'pragmatic',
                       kinds: new Set(['pragmatic', 'nominal']),
                     }
                   }
                 },
                 '>': {
                   name:  'greaterThan',
                   key:   '>',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                   nodes: {
                     '=': {
                       name:  'greaterThanOrEqual',
                       key:   '>=',
                       kind:  'pragmatic',
                       kinds: new Set(['pragmatic', 'nominal']),
                     }
                   }
                 },
                 '&': {
                   name:  'parallel',
                   key:   '&',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '|': {
                   name:  'alternation',
                   key:   '|',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 ';': {
                   name:  'sequence',
                   key:   ';',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                 },
                 '.': {
                   name:  'select',
                   key:   '.',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                   nodes: {
                     '.': {
                       name:  'range',
                       key:   '..',
                       kind:  'pragmatic',
                       kinds: new Set(['pragmatic', 'nominal']),
                     }
                   }
                 },
                 '=': {
                   name:  'bind',
                   key:   '=',
                   kind:  'pragmatic',
                   kinds: new Set(['pragmatic', 'nominal']),
                   nodes: {
                     '>': {
                       name:  'transformation',
                       key:   '=>',
                       kind:  'pragmatic',
                       kinds: new Set(['pragmatic', 'nominal']),
                     }
                   }
                 },
               };

