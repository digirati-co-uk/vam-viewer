const config = require('@fesk/scripts/webpack');

config.externals = {
  'node-fetch': 'fetch',
  'fetch-cookie/node-fetch': 'fetch',
  openseadragon: 'openseadragon',
  react: 'react',
  'react-dom': 'react-dom',
  'manifesto.js': 'manifesto.jd',
  'react-flip-move': 'react-flip-move',
  'react-draggable': 'react-draggable',
};

module.exports = config;
