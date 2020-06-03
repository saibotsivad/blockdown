import { parse } from './src/index.js'
import { readFileSync } from 'fs'
import { test } from 'zora'
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

test('block delimiters', t => {
	for (const [ message, delimiter, expected ] of blockDelimiters) {
		t.equal(parse(delimiter).blocks[0], expected, message)
	}
})

test('all test files', t => {
	for (const { path, export: expected } of globbedTests) {
		const string = readFileSync(
			path.replace(/\.js$/, '.md'),
			{ encoding: 'utf8' }
		)
		t.equal(parse(string), expected, path)
	}
})
