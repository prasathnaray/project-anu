const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve('stream-browserify'),
    url: require.resolve('url/'),
    assert: require.resolve('assert/'),
    https: require.resolve('https-browserify'),
    process: require.resolve('process/browser.js'), // <- ADD `.js`
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: 'process/browser.js', // <- ADD `.js`
      Buffer: ['buffer', 'Buffer'],
    }),
  ];
  return config;
};