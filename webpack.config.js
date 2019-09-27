const path = require('path');

const paths = {
	build: path.resolve(__dirname, './build'),
	src: __dirname
}

module.exports = (env, options) => {
	return {
		resolve: {
			extensions: ['.ts']
		},
		entry: path.join(paths.src, 'main.ts'),
		output: {
			path: paths.build,
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: [
						"ts-loader"
					]
				},
			]
		},
	};
};
