const os = require('os');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});
const options = require('./webpack.options.js');


module.exports = {
  entry: options.entry,
  output: {
    path: options.output,
    filename: '[name].js'
  },
  module: {
    loaders: [
      // css
      {
        test: /^.*\.css$/,
        loader: 'happypack/loader?id=css_loader'
      },
      // sass
      {
        test: /^.*\.sass$/,
        loader: 'happypack/loader?id=sass_loader'
      },
      // react
      {
        test: /^.*\.js$/,
        loader: 'happypack/loader?id=react_loader'
      }
    ]
  },
  plugins: [
    /* 允许错误不打断程序 */
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),

    /* HappyPack */
    // sass
    new HappyPack({
      id: 'sass_loader',
      loaders: ['style-loader!raw-loader!sass-loader'],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    }),
    // react
    new HappyPack({
      id: 'react_loader',
      loaders: [{
        path: 'babel-loader',
        query: {
          presets: ['react']
        }
      }],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    })
  ]
};
