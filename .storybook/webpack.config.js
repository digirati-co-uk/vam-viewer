const config = require('@fesk/scripts/lib/scripts/parts/storybook/react/webpack.config');

module.exports = (props) => {
  props.config.externals = {
    'node-fetch': 'fetch',
    'fetch-cookie/node-fetch': 'fetch',
  };
  // props.config.module.rules.push({
  //   test: /\.scss$/,
  //   use: [
  //     'style-loader',
  //     'css-loader',
  //     'sass-loader',
  //   ],
  // });
  // // Taking our the default css one here, as it seems to be conflicting with the scss one
  // const reducedRules = props.config.module.rules.filter(rule => String(rule.test) !== String(/\.css$/));
  // props.config.module.rules = reducedRules;
  return config(props);
};
