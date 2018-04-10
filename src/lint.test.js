const test = require('ava');
const lint = require('./lint.js');

test('lint partials with rules', (t) => {
  t.notThrows(() => lint([{
    id: 'test',
    content: 'test_var = 123',
  }]));
  t.throws(() => lint([{
    id: 'test',
    content: 'bad_var = 123',
  }]));
});
