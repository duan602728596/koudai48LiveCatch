/* 生产环境 */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const { proHtmlWebpackPlugin } = require('./htmlWebpackPlugin');
const config = require('./webpack.config');
const cssConfig = require('./css.config');
const sassConfig = require('./sass.config');

/* 合并配置 */
module.exports = config({
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'script/[name]_[chunkhash].js',
    chunkFilename: 'script/[name]_[chunkhash]_chunk.js'
  },
  module: {
    rules: [
      { // sass
        test: /^.*\.sass$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [cssConfig, sassConfig]
        })
      },
      { // css
        test: /^.*\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        }),
        exclude: /(bootstrap.*\.css)/
      },
      { // pug
        test: /^.*\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              name: '[name].html'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 抽离css
    new ExtractTextPlugin({
      filename: 'style/[name]_[contenthash].css',
      allChunks: true
    }),
    new OptimizeCSSPlugin(),
    // html模板
    proHtmlWebpackPlugin('index', '../src/modules/index/entry/index.pug'),
    proHtmlWebpackPlugin('video', '../src/modules/video/entry/video.pug')
  ]
});