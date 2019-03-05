const test = require('ava');
const lint = require('./lint.js');

test('lint partials with rules', (t) => {
  t.notThrows(() => lint([{
    id: 'test',
    template: 'test_var = 123',
  }]));
  t.throws(() => lint([{
    id: 'test',
    template: 'bad_var = 123',
  }]));
});
