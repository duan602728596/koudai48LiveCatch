const path = require('path');
const os = require('os');
const process = require('process');
const webpack = require('webpack');
const HappyPack = require('happypack');
const manifest = require('../.dll/manifest.json');
const babelConfig = require('./babel.config');

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

function config(options){
  const conf = {
    entry: {
      index: path.join(__dirname, '../src/modules/index/entry/index.coffee'),
      video: path.join(__dirname, '../src/modules/video/entry/video.coffee')
    },
    module: {
      rules: [
        { // react & js
          test: /^.*\.coffee$/,
          use: [
            {
              loader: 'happypack/loader',
              options: {
                id: 'babel_loader'
              }
            }
          ],
          exclude: /(node_modules)/
        },
        {
          test: /(dll\.js|flv)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]_[hash].[ext]',
                outputPath: 'script/'
              }
            }
          ]
        },
        {
          test: /(bootstrap.*\.css)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]_[hash].[ext]',
                outputPath: 'style/'
              }
            }
          ]
        },
        { // 图片
          test: /^.*\.(jpg|png|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 3000,
                name: '[name]_[hash].[ext]',
                outputPath: 'image/',
              }
            }
          ]
        },
        { // 矢量图片 & 文字
          test: /^.*\.(eot|svg|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]_[hash].[ext]',
                outputPath: 'file/'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // 公共模块
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minSize: 2
      }),
      // 范围提升
      new webpack.optimize.ModuleConcatenationPlugin(),
      // dll
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: manifest
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      /* HappyPack */
      // react
      new HappyPack({
        id: 'babel_loader',
        loaders: [babelConfig, 'coffee-loader'],
        threadPool: happyThreadPool,
        verbose: true
      })
    ]
  };

  /* 合并 */
  conf.module.rules = conf.module.rules.concat(options.module.rules);       // 合并rules
  conf.plugins = conf.plugins.concat(options.plugins);                      // 合并插件
  conf.output = options.output;                                             // 合并输出目录
  if('devtool' in options){                                                 // 合并source-map配置
    conf.devtool = options.devtool;
  }

  return conf;
}

module.exports = config;