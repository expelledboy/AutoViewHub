const test = require('ava');
const R = require('ramda');
const { fetchTemplates, discriminate } = require('./modules.js');

test('fetchTemplates returns templates discriminate splits into core and modules', async (t) => {
  t.plan(4);
  const templates = await fetchTemplates('./tmpl');
  const { core, modules } = discriminate(templates);
  t.truthy(core);
  t.deepEqual(
    R.pipe(R.map(R.prop('id')), R.uniq)(core),
    ['core', 'strategy', 'study'],
  );
  t.truthy(modules);
  const macd = modules.find(R.whereEq({ id: 'macd' }));
  t.deepEqual(
    R.keys(macd),
    ['id', 'function', 'template'],
  );
});
