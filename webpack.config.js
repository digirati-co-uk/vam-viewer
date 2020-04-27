const config = require('@fesk/scripts/webpack');

config.externals = {
  'node-fetch': 'fetch',
  'fetch-cookie/node-fetch': 'fetch',
  react: 'react',
  'react-dom': 'react-dom',
  openseadragon: 'openseadragon',
};
module.exports = config;
