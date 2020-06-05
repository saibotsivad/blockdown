import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import resolve from 'rollup-plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import svelte from 'rollup-plugin-svelte'

const production = !process.env.ROLLUP_WATCH

export default {
	input: 'app.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'blockdownRepl',
		file: 'build.js'
	},
	plugins: [
		!production && serve({
			contentBase: './',
			port: 3000
		}),
		!production && livereload(),
		commonjs(),
		resolve({
			browser: true
		}),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('build.css')
			}
		}),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}
