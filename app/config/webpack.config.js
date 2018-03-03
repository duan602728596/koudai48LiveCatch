const path = require('path');
const process = require('process');
const webpack = require('webpack');
const manifest = require('../.dll/manifest.json');
const babelConfig = require('./babel.config');

function config(options){
  const conf = {
    mode: process.env.NODE_ENV,
    entry: {
      index: path.join(__dirname, '../src/modules/index/entry/index.coffee'),
      video: path.join(__dirname, '../src/modules/video/entry/video.coffee')
    },
    module: {
      rules: [
        { // react & js
          test: /^.*\.coffee$/,
          use: [babelConfig, 'coffee-loader'],
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
      // dll
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: manifest
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  };

  /* 合并 */
  conf.module.rules = conf.module.rules.concat(options.module.rules);       // 合并rules
  conf.plugins = conf.plugins.concat(options.plugins);                      // 合并插件
  conf.output = options.output;                                             // 合并输出目录
  if('devtool' in options) conf.devtool = options.devtool;                  // 合并source-map配置

  return conf;
}

module.exports = config;