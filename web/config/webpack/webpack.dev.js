const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

const helpers = require('../helpers');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

module.exports = function (options) {
  return webpackMerge(commonConfig({
    env: ENV
  }), {
      devtool: '#inline-source-map',
      output: {
        path: helpers.root('target', 'site', 'web'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js',
        library: 'ac_[name]',
        libraryTarget: 'var',
      }
    });
};
