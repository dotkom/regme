var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./src/app/index.js",
    output: {
        path: __dirname,
        filename: "src/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
}

// Need to run:
// $ npm install webpack-dev-server@1.12.1 -g