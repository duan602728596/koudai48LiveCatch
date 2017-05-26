/* 开发环境 */

const path = require('path');
const config = require('./webpack.config');


const plugins = [];


{
  for(let i = 0, j = plugins.length; i < j; i++){
    config.plugins.push(plugins[i]);
  }
}


module.exports = config;