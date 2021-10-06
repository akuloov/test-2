const del = require('del');
const path = require('path');
const fs = require('fs'); // устанавливать не нужно
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const srcPath = 'resources';
const distPath = 'dist/css';
const srcSCSSfile = 'resources/sass/app.scss';

function localFolderName (ignoreParentFolder = []) {
	const _getFolder = (arr = path.normalize(process.cwd()).split(path.sep)) => {
		localFolderName = arr.pop();
		if (~ignoreParentFolder.indexOf(localFolderName)) {
			_getFolder(arr);
		}
	};
	let localFolderName = '';
	_getFolder();
	return localFolderName;
}

function styleLoaderExcludePaths (list) {
	let pattern = list.join('|');
	pattern = pattern.replace(/\\/g, '\\\\');
	pattern = pattern.replace(/\//g, '\\/');
	pattern = pattern.replace(/\./g, '\\.');
	return new RegExp(`(${pattern})`, 'i');
}

const host = localFolderName();

const styleLoaders = {
	css: {
		loader: 'css-loader',
		options: {
			url: false,
			importLoaders: 2 // так и не понял зачем
		}
	},
	postcss: {
		loader: 'postcss-loader',
		options: {
			postcssOptions: {
				plugins: [
					require('autoprefixer')({
						cascade: false // true нужен только для красоты
					}),
					require('css-mqpacker')({
						sort: require('sort-css-media-queries')
					})
				]
			}
		}
	},
	sass: {
		loader: 'sass-loader',
		options: {
			// sourceMap: true,
		}
	}
};

module.exports = (env) => {
	const isProduction = env.mode === 'production';

	if (env.clear) {
		del.sync(distPath);
	}

	const webpackConfig = {
		mode: env.mode,
		devtool: isProduction ? false : 'inline-source-map',
		entry: {
			style: path.resolve(srcPath, 'sass/app.scss')
		},
		output: {
			path: path.resolve(distPath),
			filename: '[name].js',
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css'
			})
		],
		module: {
			rules: [{
				test: /\.(sc|c)ss$/,
				exclude: styleLoaderExcludePaths([path.resolve(srcSCSSfile)]),
				use: isProduction ? [
					'style-loader',
					styleLoaders.css,
					styleLoaders.postcss,
					styleLoaders.sass
				] : [
					'style-loader',
					styleLoaders.css,
					styleLoaders.sass
				]
			}, {
				test: path.resolve(srcSCSSfile),
				use: isProduction ? [
					MiniCssExtractPlugin.loader,
					styleLoaders.css,
					styleLoaders.postcss,
					styleLoaders.sass
				] : [
					MiniCssExtractPlugin.loader,
					styleLoaders.css,
					styleLoaders.sass
				]
			}]
		}
	};

	if (isProduction) {
		webpackConfig.optimization = {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						format: {
							comments: false
						}
					},
					extractComments: false
				})
			]
		};
	}

	if (env.watch) {
		const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
		webpackConfig.plugins.push(new BrowserSyncPlugin({
			host: host,
			proxy: `http://${host}`,
			open: 'external',
			port: 4000,
			files: [
				distPath + '/**/*.css',
				'*.html'
			]
		}, {
			reload: false
		}));
	}

	return webpackConfig;
};
