const config = require('@fesk/scripts/webpack');

config.externals = {
  'node-fetch': 'fetch',
  'fetch-cookie/node-fetch': 'fetch',
  react: 'React',
  'react-dom': 'ReactDOM',
  openseadragon: 'OpenSeadragon',
};

module.exports = config;
