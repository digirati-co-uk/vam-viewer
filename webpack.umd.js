const path = require('path');
const baseConfig = require('@fesk/scripts/webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MetalsmithWebpackPlugin = require('@fesk/plugin-metalsmith');

const fullName = '@digirati/vam-viewer';
const packageName = 'digiratiVamViewer';

const plugins = baseConfig.plugins
  .map(plugin => {
    if (plugin instanceof MetalsmithWebpackPlugin) {
      return null;
    }
    if (plugin instanceof CleanWebpackPlugin) {
      return new CleanWebpackPlugin({
        ...plugin.options,
        cleanOnceBeforeBuildPatterns: ['umd'],
      });
    }
    return plugin;
  })
  .filter(Boolean);

const config = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(process.cwd(), 'dist', 'umd'),
    filename: `${fullName}.js`,
    libraryTarget: 'umd',
    library: packageName,
    umdNamedDefine: true,
    chunkFilename: '[name].bundle.js',
    globalObject: 'this',
  },
  plugins,
  externals: baseConfig.externals,
});

config.externals = {
  'node-fetch': 'fetch',
  'fetch-cookie/node-fetch': 'fetch',
  react: 'react',
  'react-dom': 'react-dom',
  'react-reconciler': 'react-reconciler',
  openseadragon: 'openseadragon',
};

module.exports = config;