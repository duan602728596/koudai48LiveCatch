/* 生产环境 */

const os = require('os');
const config = require('./webpack.config');
const WebpackUglifyParallel = require('webpack-uglify-parallel');

const plugins = [
  new WebpackUglifyParallel({
    workers: os.cpus().length,
    mangle: true,
    compressor: {
      warnings: true,
      drop_console: true,
      drop_debugger: true
    }
  })
];


{
  for(let i = 0, j = plugins.length; i < j; i++){
    config.plugins.push(plugins[i]);
  }
}


module.exports = config;