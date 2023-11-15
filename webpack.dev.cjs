const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');


module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, './frontend/public'),
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
});
