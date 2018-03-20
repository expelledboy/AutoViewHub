const fs = require('fs');
const path = require('path');
const glob = require('glob');
const Mustache = require('mustache');

const config = require('./config.json');

// https://github.com/janl/mustache.js/pull/242#issuecomment-354032429
function render(template, view, partials = {}) {
  const prototype = {};
  const templateWithDynamicPartials = template.replace(/\{\{>(.*?\(.+?\).*?)\}\}/g, (_match, name) => {
    if (!prototype[name]) {
      prototype[name] = function renderPartial() {
        const computed = name.replace(/\((.*?)\)/, (_match2, property) => this[property]);
        if (!partials[computed])
          throw new Error(`Dynamic partial '${computed}' does not exist.`);
        return render(partials[computed], this, partials);
      };
    }
    return `{{{${name}}}}`;
  });
  const prot = Object.assign(Object.create(prototype), view);
  return Mustache.render(templateWithDynamicPartials, prot, partials);
}

const rules = strategy => [
  {
    rule: 'all lines to begin with strategy id',
    when: /^[^ ] +=/,
    pattern: new RegExp(`^(${strategy.id}|long|short)`),
  },
];

function lint(partials) {
  Object.keys(partials).forEach((partial) => {
    const content = partials[partial];
    const lines = content.match(/[^\r\n]+/g);
    const strategy = config.strategies.find(strat => strat.id === partial);
    if (!strategy) return;
    const tests = rules(strategy);
    const test = line => tests.forEach(({ rule, when, pattern }) => {
      if (!when.test(line)) return;
      const valid = pattern.test(line);
      if (!valid) throw new Error(`lint failed - ${rule}`);
    });
    lines.forEach(test);
  });
}

const file = process.argv[2];
const template = fs.readFileSync(file, 'utf8');

const partials = {};
const files = glob.sync('src/*.mustache');

files.forEach((filename) => {
  const content = fs.readFileSync(filename, 'utf8');
  const partial = path.basename(filename, '.mustache');
  partials[partial] = content;
});

lint(partials);

const content = render(template, config, partials);
console.log(content);
