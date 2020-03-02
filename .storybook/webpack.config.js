const config = require('@fesk/scripts/lib/scripts/parts/storybook/react/webpack.config');

module.exports = (props) => {

  props.config.externals = {
    'node-fetch': 'fetch',
    'fetch-cookie/node-fetch': 'fetch',
  };

  return config(props);
};
