const WebpackMessages = require('webpack-messages')

module.exports = {
	entry: {
		webuffet: ['./src/main']
	},

	mode: 'development',
	devtool: 'inline-source-map',
	output : {
		path: __dirname + '/extension/build',
		filename: '[name].built.js'
	},
	resolve: {
		extensions: [ '.js', '.ts', '.scss', 'html' ]
	},
	module: {
		rules: [
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
					'style-loader',
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
					'style-loader',
					'css-loader'
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
		new WebpackMessages({
      name: 'WEBuffet',
      logger: str => console.log(`>> ${str}`)
    })
	]
}