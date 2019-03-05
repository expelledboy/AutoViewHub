/* eslint-disable no-return-assign */

const R = require('ramda');
const lint = require('./lint.js');
const render = require('./render.js');
const config = require('./config.json');
const { fetchTemplates, filterCoreTemplates } = require('./modules.js');

const script_type = process.argv[2];

if (['strategy', 'study'].indexOf(script_type) < 0)
  throw new Error('./build [strategy|study]');

async function main() {
  const templates = await fetchTemplates('./tmpl');
  const { core, modules } = filterCoreTemplates(templates);

  lint(modules);

  // we need to create mustache compliant partials
  const partials = {};
  core.forEach(({ id, section, template }) => partials[`${id}_${section}`] = template);
  modules.forEach(({ id, template }) => partials[id] = template);
  const { template: baseTemplate } = core.find(R.whereEq({ id: 'core' }));

  // context
  const context = R.merge(R.pick([
    'strats',
    'signal'
  ], config), {
    script_type,
    script_init: `${script_type}_init`,
    script_report: `${script_type}_report`,
  });

  // render the template with partials it can use
  const content = render(baseTemplate, context, partials);

  // merge multiline statements, avoid wierd errors
  const output = content.replace(/\\\n\s+/g, "");
  console.log(output);
}

main().catch(err => {
  console.error('ERROR', err.message);
});
