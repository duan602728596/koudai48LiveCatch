const path = require('path');

module.exports = {
  entry: {
    router: path.join(__dirname, '/script/router.js'),
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'redux'
    ]
  },
  output: path.join(__dirname, '/script/dist')
};
