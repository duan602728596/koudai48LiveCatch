/* 开发环境 */
const path = require('path');
const { devHtmlWebpackPlugin } = require('./htmlWebpackPlugin');
const config = require('./webpack.config');
const cssConfig = require('./css.config');
const sassConfig = require('./sass.config');

/* 合并配置 */
module.exports = config({
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'script/[name].js',
    chunkFilename: 'script/[name]_chunk.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      { // sass
        test: /^.*\.sass$/,
        use: ['style-loader', cssConfig, sassConfig]
      },
      { // css
        test: /^.*\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /(bootstrap.*\.css)/
      },
      { // pug
        test: /^.*\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true,
              name: '[name].html'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // html模板
    devHtmlWebpackPlugin('index', '../src/modules/index/entry/index.pug'),
    devHtmlWebpackPlugin('video', '../src/modules/video/entry/video.pug')
  ]
});