const rules = strategy => [
  {
    rule: 'all lines to begin with strategy id',
    when: /=/,
    pattern: new RegExp(`^(${strategy.id}|long|short)`),
  },
];

function lint(partials) {
  partials.forEach((strategy) => {
    const { id, template } = strategy;
    const lines = template.match(/[^\r\n]+/g);
    const tests = rules(strategy);
    const test = (line, index) => tests.forEach(({ rule, when, pattern }) => {
      if (!when.test(line)) return;
      const valid = pattern.test(line);
      if (!valid) throw new Error(`lint(${id}:${index}) - ${rule}`);
    });
    lines.forEach(test);
  });
}

module.exports = lint;
