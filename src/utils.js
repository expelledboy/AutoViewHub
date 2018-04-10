const R = require('ramda');
const { promisify } = require('util');

const promisifyObj = R.map(promisify);

module.exports = {
  promisify: promisifyObj,
};
