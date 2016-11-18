const path = require('path');
const config = require('./webpack.config');

module.exports = Object.assign(config, {
  resolve: {
    alias: {
      'elm-architecture': path.resolve(__dirname, '../../src')
    }
  }
});