const Mustache = require('mustache');

// https://github.com/janl/mustache.js/pull/242#issuecomment-354032429
function render(template, view, partials = {}) {
  const prototype = {};
  const templateWithDynamicPartials = template.replace(/\{\{>(.*?\(.+?\).*?)\}\}/g, (_match, name) => {
    if (!prototype[name]) {
      prototype[name] = function renderPartial() {
        const computed = name.replace(/\((.*?)\)/, (_match2, property) => this[property]);
        if (!partials[computed])
          throw new Error(`Dynamic partial '${computed}' from '${name}' does not exist.`);
        return render(partials[computed], this, partials);
      };
    }
    return `{{{${name}}}}`;
  });
  const prot = Object.assign(Object.create(prototype), view);
  return Mustache.render(templateWithDynamicPartials, prot, partials);
}

module.exports = render;
