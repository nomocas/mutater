import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);

export default {
	entry: 'src/index.js',
	plugins: [babel(babelrc())],
	external,
	targets: [{
		dest: pkg.main,
		format: 'umd',
		moduleName: 'mutater',
		sourceMap: true
	}, {
		dest: pkg.module,
		format: 'es',
		sourceMap: true
	}]
};

