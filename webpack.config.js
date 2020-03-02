const config = require('@fesk/scripts/webpack');

config.externals = {
  'node-fetch': 'fetch',
  'fetch-cookie/node-fetch': 'fetch',
};

module.exports = config;
