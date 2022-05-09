const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'src'),
    },
    open: true,
    hot: true,
    liveReload: true,
    watchFiles: ['src/**/*'],
  },
});
