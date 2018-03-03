/* css-loader 配置 */
// css in js 的输出名称
const name = '[path][name]__[local]___[hash:base64:15]';

module.exports = {
  loader: 'css-loader',
  options: {
    modules: true,
    localIdentName: name
  }
};