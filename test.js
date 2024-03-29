import { readFileSync } from 'node:fs'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { parse } from './src/index.js'
import globbedTests from './globbed-tests.js'

const blockDelimiters = [
	[
		'only has a name',
		'---!foo',
		{
			name: 'foo'
		}
	],[
		'has a name and data',
		'---!foo[bar]',
		{
			name: 'foo',
			metadata: 'bar'
		}
	],[
		'has a name and id',
		'---!foo#bar',
		{
			name: 'foo',
			id: 'bar'
		}
	],[
		'has a name and data',
		'---!foo#bar[fizz]',
		{
			name: 'foo',
			id: 'bar',
			metadata: 'fizz'
		}
	],[
		'multiline metadata',
		[
			'---!foo#bar[',
			'  fizz',
			']'
		].join('\n'),
		{
			name: 'foo',
			id: 'bar',
			metadata: '  fizz'
		}
	],[
		'multiline metadata without id',
		[
			'---!foo[',
			'  fizz',
			']'
		].join('\n'),
		{
			name: 'foo',
			metadata: '  fizz'
		}
	]
]

test('block delimiters', () => {
	for (const [ message, delimiter, expected ] of blockDelimiters) {
		assert.equal(parse(delimiter).blocks[0], expected, message)
	}
})

test('all test files', () => {
	for (const { path, export: expected } of globbedTests) {
		const string = readFileSync(
			path.replace(/\.js$/, '.md'),
			{ encoding: 'utf8' }
		)
		assert.equal(parse(string), expected, path)
	}
})

test.run()
