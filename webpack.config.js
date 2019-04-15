const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: 'development',
	entry: {
		app: path.resolve(__dirname, 'src/index.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader'
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
			'@src': path.resolve(__dirname, 'src')
		}
	},
	plugins: isProduction ? [new MiniCssExtractPlugin()] : []
}