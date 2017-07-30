var webpack = require('webpack');

module.exports = {
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
      new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
      })
    ],

};