/* babel-loader 配置 */
const path = require('path');

module.exports = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: path.join(__dirname, '../.babelCache'),
    presets: ['@babel/react']
  }
};