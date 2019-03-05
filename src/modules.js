const fs = require('fs');
const glob = require('glob');
const R = require('ramda');

const { promisify } = require('./utils.js');

const promise = promisify({
  glob,
  readFile: fs.readFile,
});

const fetchTemplates = async (basedir = '../tmpl') => {
  const extention = '.tmpl';
  const filenames = await promise.glob(`${basedir}/**/*${extention}`);
  return Promise.all(filenames.map(async (filename) => {
    const template = await promise.readFile(filename, 'utf8');
    const path = filename
      .replace(`${basedir}/`, '')
      .replace(extention, '')
      .split('/');
    return {
      id: path[0],
      section: path[1],
      template,
    };
  }));
};

const filterCoreTemplates = (templates) => {
  const [core, modules] = R.partition(R.where({
    id: R.contains(R.__, ['core', 'strategy', 'study']),
  }), templates);
  return {
    core,
    modules,
  };
};

module.exports = {
  fetchTemplates,
  filterCoreTemplates,
};
