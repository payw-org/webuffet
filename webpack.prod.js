const merge = require('webpack-merge')
const config = require('./webpack.config.js')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(config, {
	mode: 'production',
	devtool: '',
	optimization: {
    minimizer: [
			new TerserJSPlugin({
        terserOptions: {
          drop_console: true
        }
      }),
			new OptimizeCSSAssetsPlugin({})
		],
  }
})