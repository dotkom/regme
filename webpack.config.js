var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var JsDocPlugin = require('jsdoc-webpack-plugin-v2')

var env = {
  'RG_BASE': "http://localhost:8000/",
  'RG_API_BASE': "api/v1/",
  'RG_API_EVENTS': 'events/',
  'RG_API_AUTH': 'auth/',
  'RG_API_ATTENDEES': 'attendees/',
  'RG_API_ATTEND': 'attend/',
  'RG_API_USERS': 'users/',
  'RG_CLIENT_SECRET': '',
  'RG_CLIENT_ID': '',
  'RG_SENTRY_DSN': '',
  'NODE_ENV': 'production'
};

var APP_ENTRY = path.join(__dirname, './app');
var APP_SRC = path.join(APP_ENTRY, './src');


var extractLess = new ExtractTextPlugin({
  filename: '[name].[hash].css',
  disable: process.env.NODE_ENV === "development"
});


module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    'react-hot-loader/patch',
    path.join(APP_SRC,'./index.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  },
  devtool:  'inline-source-map',
  resolve: { 
    extensions: ['.js','.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [
            {loader: 'css-loader'},
            {loader: 'less-loader',options:{
              includePaths: [path.join(APP_SRC, './assets')]
            }}
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(png|gif|jpe?g)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?[a-z0-9=&.]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    }),
    new webpack.EnvironmentPlugin(env),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => (
        module.context && module.context.indexOf('node_modules') !== -1
      )
    }),
    extractLess,
    new JsDocPlugin({
      conf: path.join(__dirname, './jsdoc.conf.json'),
    })
  ]
}
