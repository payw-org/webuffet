const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackMessages = require('webpack-messages')

module.exports = {
	entry: {
		webuffet: ['./src/main'],
		HideHtml: ['./src/HideHtml']
	},

	mode: 'development',
	devtool: 'inline-source-map',
	output : {
		path: __dirname + '/extension/build',
		filename: '[name].built.js'
	},
	resolve: {
		extensions: ['.js', '.ts', '.css', '.scss', '.html', '.vue'],
		alias: {
			vue$: 'vue/dist/vue.esm.js',
			Components: __dirname + '/src/components/'
		}
	},
	module: {
		rules: [
			{
        test: /\.vue$/,
				loader: 'vue-loader'
      },
			{
				test: [/\.tsx?$/],
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					},
					'ts-loader'
				]
			},
			{
				test: [/\.js$/],
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				]
			},
			{
				test: [/\.scss$/],
				use: [
					{
						loader: 'style-loader',
						options: {
							insertInto: 'html'
						}
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								require('autoprefixer')
								({
									'browsers': ['> 1%', 'last 2 versions']
								})
							]
						}
					},
					'sass-loader'
				]
			},
			{
				test: [/\.css$/],
				use: [
					{
						loader: 'style-loader',
						options: {
							insertInto: 'html'
						}
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								require('autoprefixer')
								({
									'browsers': ['> 1%', 'last 2 versions']
								})
							]
						}
					},
				]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
			},
			{
				test: /\.svg/,
				use: {
						loader: 'svg-url-loader',
						options: {}
				}
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new WebpackMessages({
      name: 'WEBuffet',
      logger: str => console.log(`>> ${str}`)
    })
	]
}