const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
	plugins: isProduction ? [new MiniCssExtractPlugin()] : [],
	optimization: {
		splitChunks: {
			chunks: 'all',
			minSize: 30000,
			maxSize: 0,
			minChunks: 1,				
			name: true,
			cacheGroups: {			
				vendors: {
				  test: /[\\/]node_modules[\\/](react|react-dom|mobx|mobx-react|prettier|react-codemirror|react-highlight|highlight.js|@babel|babel-runtime)[\\/]/,
				  priority: -10
				},
				default: {
				  minChunks: 2,
				  priority: -20,
				  reuseExistingChunk: true
				}
			}
		},
		runtimeChunk: true,
		minimizer: [
			new TerserPlugin({
			  terserOptions: {
				cache: true,
				parallel: true,
				warnings: false,				  
				output: {
					comments: false,
				  }
			  }
			})
		]	
	}
}