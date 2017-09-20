var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

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
  'RG_SENTRY_ID': '',
  'NODE_ENV': 'production'
};


module.exports = {
  entry: ['babel-polyfill','./index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: { 
    extensions: ['.js','.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'less-loader'
        })
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => (
        module.context && module.context.indexOf('node_modules') !== -1
      )
    }),
    new ExtractTextPlugin('styles.css'),
    new webpack.EnvironmentPlugin(env)
  ]
}
