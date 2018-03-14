var webpack = require('webpack');
var RefreshBrowserPlugin = require('refresh-browser-webpack-plugin');


module.exports = {
  devtool: 'cheap-module-source-map',
  entry: "./src/scripts/app.js",
  output: {
      path: __dirname,
      filename: "./public/js/bundle.js"
  },
  module: {
      loaders: [
          { test: /\.css$/, loader: "style!css" }
      ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //       warnings: false
    //   }
    // }),
    new RefreshBrowserPlugin()
  ],

};
