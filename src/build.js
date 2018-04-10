/* eslint-disable no-return-assign */

const R = require('ramda');
const lint = require('./lint.js');
const render = require('./render.js');
const config = require('./config.json');
const { fetchTemplates, discriminate } = require('./modules.js');

const chart = process.argv[2];

if (['strategy', 'study'].indexOf(chart) < 0)
  throw new Error('./build [strategy|study]');

async function main() {
  const templates = await fetchTemplates('./tmpl');
  const { core, modules } = discriminate(templates);

  // modules come from contributions
  lint(modules);

  const settings = R.merge(config, {
    chart,
    chart_init: `${chart}_init`,
    chart_report: `${chart}_report`,
  });

  // we need to create mustache compliant partials
  const partials = {};
  core.forEach(({ id, section, template }) => partials[`${id}_${section}`] = template);
  modules.forEach(({ id, template }) => partials[id] = template);
  const { template } = core.find(R.whereEq({ id: 'core' }));

  // finally render the template with partials it can use
  const content = render(template, settings, partials);
  console.log(content);
}

main();
