const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: 'production',
	entry: {
		app: path.resolve(__dirname, 'src/index.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: path.resolve(__dirname, 'node_modules')
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			},
		]
	},
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, 'src'),
			'prettier': path.resolve(__dirname, 'node_modules/prettier/standalone.js')
		}
	},
	plugins: isProduction ? [new MiniCssExtractPlugin()] : []
}