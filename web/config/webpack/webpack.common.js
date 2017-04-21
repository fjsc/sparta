const webpack = require('webpack');
const helpers = require('../helpers');

/*
 * Webpack Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

const AOT = helpers.hasNpmFlag('aot');


module.exports = function (options) {
    isProd = options.env === 'production';
    return {
      entry: {
        'main': AOT ? './src/main.aot.ts' : './src/main.ts',
        'polyfills': './src/polyfills.ts'
      },
      resolve: {
        alias: {
          'shared': helpers.root('src', 'app', 'shared'),
          'views': helpers.root('src', 'views')
        },
        extensions: ['.ts', '.js', '.json'],
        modules: [helpers.root('src'), helpers.root('node_modules')],
      },
      node: {
        global: true,
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: 'src/index.html',
          chunksSortMode: 'dependency'
        }),
      ],
      module: {
        loaders: [{
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        }]

      }
    }
}
