const rules = strategy => [
  {
    rule: 'all lines to begin with strategy id',
    when: /=/,
    pattern: new RegExp(`^(${strategy.id})`),
  },
];

const patternMatch = strategy => {
  const { id, template } = strategy;
  const lines = template.match(/[^\r\n]+/g);
  const tests = rules(strategy);
  const test = (line, index) => tests.forEach(({ rule, when, pattern }) => {
    if (!when.test(line)) return;
    const valid = pattern.test(line);
    if (!valid) throw new Error(`lint(${id}) ${rule}\n\n${index}: ${line}`);
  });
  lines.forEach(test);
}

const linters = [
  patternMatch,
];

function lint(partials) {
  partials.forEach((strategy) => {
    linters.forEach(linter => linter(strategy));
  });
}

module.exports = lint;

