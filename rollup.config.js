import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import svelte from 'rollup-plugin-svelte'
import css from 'rollup-plugin-css-only'

const production = !process.env.ROLLUP_WATCH

export default {
	input: 'src/app.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'blockdownRepl',
		dir: './docs'
	},
	plugins: [
		svelte(),
		css({ output: 'app.css' }),
		commonjs(),
		nodeResolve({
			browser: true
		}),
		!production && serve({
			contentBase: './docs',
			port: 3000
		}),
		!production && livereload(),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}
