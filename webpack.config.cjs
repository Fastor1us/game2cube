const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './frontend/src/index.js',
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'game2cube',
      templateContent: `
        <!DOCTYPE html>
        <html>
          <body>
            <div id="app"></div>
          </body>
        </html>
      `,
    }),
  ],
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: path.resolve(__dirname, './src/index.html'),
  //   }),
  //   isDevelopment && new ReactRefreshWebpackPlugin(),
  // ].filter(Boolean),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './frontend/dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          },
          // options: {
          //   plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
          // },
        }
      }
    ]
  }
};
